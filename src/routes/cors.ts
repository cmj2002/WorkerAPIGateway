import { Hono } from 'hono'
import { Env } from '../types';

const cors = new Hono<Env>();

cors.all('/', async (c) => {
    const target=c.req.query('target');
    const redirect=(c.req.query('redirect')==='false')?false:true;

    // Return 204 if the request is an OPTIONS request
    if(c.req.method==='OPTIONS'){
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400'
            }
        });
    }

    if(target){
        // Copy everything from the request except url
        let toFetch=new Request(target, {
            method: c.req.method,
            headers: c.req.headers,
            body: c.req.body,
            redirect: redirect?'follow':'manual'
        });

        // Fetch the target
        const res=await fetch(toFetch);

        // Copy everything from the response
        let newRes=new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers
        });

        // Add CORS headers
        newRes.headers.set('Access-Control-Allow-Origin', '*');
        newRes.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
        newRes.headers.set('Access-Control-Allow-Headers', '*');
        newRes.headers.set('Access-Control-Allow-Credentials', 'true');
        newRes.headers.set('Access-Control-Max-Age', '86400');

        return newRes;
    }else{
        return c.json({
            error: 'target not specified',
            msg: 'example: /cors?target=https://example.com'
        }, 400);
    }
});

export { cors };