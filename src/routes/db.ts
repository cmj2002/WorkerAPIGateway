import { Hono } from 'hono'
import { config } from '../config';
import { Env } from '../types';
import { StatusCode } from 'hono/utils/http-status';

type DbRequest = {
    action: 'put'|'delete'|'get'|'list',
    key: string
    value?: string
    ttl?: number
    safe?: boolean
}

interface handlerOutput {
    status: StatusCode,
    body: any
}



function validateRequestBody(body: any): DbRequest {
    // validate action
    if (typeof body.action !== 'string') {
        throw new Error('Invalid action, must be a string');
    }
    if (!['put', 'delete', 'get', 'list'].includes(body.action)) {
        throw new Error('Invalid action, must be one of: put, delete, get, list');
    }
    // validate key
    if (typeof body.key !== 'string') {
        throw new Error('Invalid key, must be a string');
    }
    // validate value
    if (body.value && typeof body.value !== 'string') {
        throw new Error('Invalid value, must be a string');
    }
    // validate ttl
    if (body.ttl && typeof body.ttl !== 'number') {
        throw new Error('Invalid ttl, must be a number');
    }
    // validate safe
    if (body.safe && typeof body.safe !== 'boolean') {
        throw new Error('Invalid safe, must be a boolean');
    }
    return body;
}

const db = new Hono<Env>();

async function handleGet(body:DbRequest, kv: KVNamespace):Promise<handlerOutput> {
    const value = await kv.get(body.key);
    if (value) {
        return {
            status: 200,
            body: {
                key: body.key,
                value: value 
            }
        };
    } else {
        return {
            status: 404,
            body: { error: 'Key not found' }
        };
    }
}

async function handlePut(body:DbRequest, kv: KVNamespace):Promise<handlerOutput> {
    const { key, value, ttl, safe } = body;
    if (safe) {
        const oldValue = await kv.get(key);
        if (oldValue) {
            return {
                status: 409,
                body: { error: 'Key already exists' }
            };
        }
    }
    if (value){
        if (ttl) {
            await kv.put(key, value, { expirationTtl: ttl });
            return {
                status: 200,
                body: {
                    key: key,
                    value: value,
                    ttl: ttl
                }
            };
        } else {
            await kv.put(key, value);
            return {
                status: 200,
                body: {
                    key: key,
                    value: value
                }
            };
        }
    } else {
        return {
            status: 400,
            body: { error: 'Missing value' }
        };
    }
}

async function handleDelete(body:DbRequest, kv: KVNamespace):Promise<handlerOutput> {
    const { key } = body;
    const value = await kv.get(key);
    if(value) {
        await kv.delete(key);
        return {
            status: 200,
            body: {
                key: key,
                value: value
            }
        };
    }else{
        return {
            status: 404,
            body: { error: 'Key not found' }
        };
    }
}

async function handleList(body:DbRequest, kv: KVNamespace):Promise<handlerOutput> {
    const { key } = body;
    const list = await kv.list({ prefix: key });
    return {
        status: 200,
        body: list.keys
    };
}

db.get('/:name/:key', async (c)=> {
    const { name, key } = c.req.param();
    const kv = config.kvBinding(name, c.env);
    if(kv){
        const res = await handleGet({action:'get',key:key}, kv);
        return c.json(res.body, res.status);
    }else{
        return c.json({ error: 'Requested database not found' }, 404);
    }
})

db.post('/:name', async (c) => {
    const name = c.req.param('name');
    const kv = config.kvBinding(name, c.env);
    if(kv){
        try{
            const body:DbRequest = validateRequestBody(await c.req.json());
            switch(body.action){
                case 'put':{
                    const res = await handlePut(body, kv);
                    return c.json(res.body, res.status);
                }
                case 'get':{
                    const res = await handleGet(body, kv);
                    return c.json(res.body, res.status);
                }
                case 'delete':{
                    const res = await handleDelete(body, kv);
                    return c.json(res.body, res.status);
                }
                case 'list':{
                    const res = await handleList(body, kv);
                    return c.json(res.body, res.status);
                }
                default:
                    throw new Error('Should not reach here');
            }
        } catch (e) {
            return c.json({ 
                error: 'Invalid body',
                msg: e.message
            }, 400);
        }
    }
    return c.json({ error: 'Requested database not found' }, 404);
});

export {db};