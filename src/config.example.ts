import{ ALL_METHODS, APIConfig, Env } from './types';

export const config:APIConfig={

    // Permission for services
    // WARNING: DELETE THE EXAMPLE SERVICE BEFORE PRODUCTION!
    ACL: [
        {
            // `service` and `token` will be used as user and password for basic auth
            service: 'example',
            token: 'ChangeMe',

            // The route that this service can access
            permissions: [
                {
                    // all requests whose path starts with `route` will be allowed
                    route: '/',
                    // Allowed methods
                    method: ALL_METHODS
                }
            ]
        }
    ],

    // Permission for public access. 
    // If a request matches any of the routes, it will be allowed without auth.
    publicAccess: [
        {
            route: '/svg',
            method: ALL_METHODS
        },
        {
            route: '/cors',
            method: ALL_METHODS
        }
    ],

    // KV binding for /db
    // How to add a KV binding:
    // 1. Create a KV
    // 2. Bind the KV by editing `wrangler.toml`
    // 3. Modify Env interface in `types.ts`
    // 4. Add a new binding in the following function
    kvBinding: function(name: string, env:Env): KVNamespace|undefined{
        switch(name){
            case 'default':
                return env.KV_DEFAULT;
            default:
                return undefined;
        }
    },

    // Mail settings
    // Use Mailchannels to send emails, API docs: https://api.mailchannels.net/tx/v1/documentation
    mailSettings: {
        // Your domain to send email. Only accept API request that send email from this domain.
        // If you enable DKIM, It will also be used as DKIM domain
        domain: 'noreply.caomingjun.com',

        // DKIM settings. About: https://mailchannels.zendesk.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature
        // If you don't know what is DKIM, just set it to false
        enableDKIM: false,
        DKIMSelector: '',
        DKIMPrivateKey: ''
    }
}