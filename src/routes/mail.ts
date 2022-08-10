import { Hono } from 'hono'
import { config } from '../config';
import { Env } from '../types';

type MailUser = {
    name: string,
    email: string
}

type Content={
    type: string,
    value: string
}

type RequestPersonalization={
    to: MailUser[],
    cc?: MailUser[],
    bcc?: MailUser[],
}

type MailRequest = {
    dryRun?: boolean,
    headers?: {
        [key: string]: string
    },
    from: MailUser,
    subject: string,
    content: Content[],
    replyTo?: MailUser,
    personalizations: RequestPersonalization[]
}

const mail = new Hono<Env>();

mail.post('/:sender', async (c) => {
    try{
        // It's too hard to validate the request body, so we just assume it's valid
        const { sender } = c.req.param();
        const body:MailRequest = await c.req.json();

        // Validate domain
        if(body.from.email!==`${sender}@${config.mailSettings.domain}`){
            return c.json({error: 'sender not allowed'}, 403);
        }

        const reqBody={
            from: body.from,
            subject: body.subject,
            content: body.content,
            headers: body.headers,
            reply_to: body.replyTo,
            personalizations: body.personalizations.map((p)=>{
                return {
                    to: p.to,
                    cc: p.cc,
                    bcc: p.bcc,
                    dkim_domain: config.mailSettings.enableDKIM?config.mailSettings.domain:undefined,
                    dkim_selector: config.mailSettings.enableDKIM?config.mailSettings.DKIMSelector:undefined,
                    dkim_private_key: config.mailSettings.enableDKIM?config.mailSettings.DKIMPrivateKey:undefined,
                }
            })
        }

        console.log("Sending email: ",JSON.stringify(reqBody, null, 2));
        console.log("Send to ",`https://api.mailchannels.net/tx/v1/send${body.dryRun?'?dry-run=true':''}`)


        const response = await fetch(`https://api.mailchannels.net/tx/v1/send${body.dryRun?'?dry-run=true':''}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        });
        return response;
    }catch(e){
        return c.json({error: 'Invalid request body'}, 400);
    }
});

export { mail };