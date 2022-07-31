interface Env {
    KV_DEFAULT: KVNamespace
}

type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' ;

const ALL_METHODS: METHOD[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

function normalizeMethod(method: string): METHOD {
    method=method.toUpperCase();
    if(!ALL_METHODS.includes(method as METHOD)){
        throw new Error(`Invalid method ${method}`);
    }else{
        return method as METHOD;
    }
}

interface Permission{
    route: string;
    method: METHOD[];
}

interface User{
    service: string
    token: string
    permissions: Permission[]
}

interface APIConfig{
    publicAccess: Permission[]
    ACL: User[]
    kvBinding: (name: string, env:Env) => KVNamespace|undefined
    mailSettings:{
        domain: string
        enableDKIM: boolean
        DKIMSelector: string
        DKIMPrivateKey: string
    }
}

export {Env, METHOD, ALL_METHODS, normalizeMethod, Permission, User, APIConfig};