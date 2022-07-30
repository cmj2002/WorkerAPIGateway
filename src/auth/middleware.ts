import {normalizeMethod} from '../types';
import {config} from '../config';
import type { Context } from 'hono';
import type { Next } from 'hono';
import {getPathFromURL} from 'hono/utils/url';
import {decodeBase64} from 'hono/utils/encode';

const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/
const USER_PASS_REGEXP = /^([^:]*):(.*)$/
const ACL=config.ACL;

const extractUser = (req: Request) => {
    const match = CREDENTIALS_REGEXP.exec(req.headers.get('Authorization') || '')
    if (!match) {
        return undefined
    }
  
    const userPass = USER_PASS_REGEXP.exec(decodeBase64(match[1]))
  
    if (!userPass) {
        return undefined
    }
  
    return ACL.find(u => u.service === userPass[1] && u.token === userPass[2]);
}

export const authMiddleware = async (c:Context, next:Next) => {
    // Extract user and token from Authorization as Basic Auth
    const auth = c.req.header('Authorization');
    if (auth) {
        const reqPath = getPathFromURL(c.req.url);
        const reqMethod = c.req.method;
        const user = extractUser(c.req);
        if (user) {
            const permission = user.permissions.find(p => reqPath.startsWith(p.route) && p.method.includes(normalizeMethod(reqMethod)));
            if (permission) {
                await next();
                return;
            }else{
                return c.json({
                    error: 'Permission denied',
                    debug: {
                        user,
                        acceptedPermissions: user.permissions,
                        requestedPermission: {
                            route: reqPath,
                            method: reqMethod
                        }
                    }
                }, 403);
            }
        } else{
            // Invalid user or token
            return c.json({
                error: 'Invalid user or token',
                debug: {
                    user
                }
            }, 401);
        }
    }else{
        // 401 Unauthorized
        return c.json({
            error: 'Unauthorized'
        }, 401, {
            'WWW-Authenticate': 'Basic'
        });
    }
}