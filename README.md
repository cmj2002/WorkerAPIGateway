# Workers API Gateway

My APIs based on [Cloudflare Workers](https://workers.cloudflare.com/).

## Available APIs

**Overview**

* `/db` - a simple database based on KV.
* `/mail` - send emails using [MailChannels](https://mailchannels.com/).
* `/cors` - CORS for any website.
* `/hook` - some webhook handlers.

For details, please check the [`document.md`](./document.md).

### public APIs

The following APIs are public. You can use them without authentication.

**I do not guarantee or assume any responsibility for the reliability of the following APIs or the correctness of the returned results, nor do I guarantee that these APIs will always be public.If you use these APIs, you agree to take full responsibility for the risks.**

You should not use these APIs for any illegal or malicious purposes.

#### CORS for any website

Request to `https://api.caomingjun.com/cors?target=<url>` will be proxy to `<url>` with same method, body and headers.

Use query parameter `follow=false` to disable following redirects.

The response will be returned as is, except CORS headers.

## Deploy your own

1. Clone this repo.
2. Run `npm install`.
3. Run `wrangler login`.
4. [Optional]Add your own KV namespace and update `wrangler.toml`.
5. `mv src/config.example.ts src/config.ts` and fill in your own config.
6. Other customizations (project name in `wrangler.toml`, HTML for `/` in `src/index.ts`, etc).
7. Run `npm run deploy`.

## TODO

* [ ] Add more APIs.
    * [x] `/cors` CORS for any website.
    * More ideas are welcome.
* [x] Allow setting public access routes in config.
* [ ] Count the number of API calls by different users.
* [x] More friendly documentation.
