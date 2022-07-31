# Workers API Gateway

My APIs based on [Cloudflare Workers](https://workers.cloudflare.com/).

## Available APIs

* `/db` - a simple database based on KV.
* `/mail` - send emails using [MailChannels](https://mailchannels.com/).

## Deploy your own

1. Clone this repo.
2. Run `npm install`.
3. Run `wrangler login`.
4. `mv src/config.example.ts src/config.ts` and fill in your own config.
5. Add your own KV namespace and update `wrangler.toml`.
6. Other customizations (project name in `wrangler.toml`, HTML for `/` in `src/index.ts`, etc).
7. Run `npm run deploy`.

## TODO

* [ ] Add more APIs.
    * [x] `/cors` CORS for any website.
    * More ideas are welcome.
* [x] Allow setting public access routes in config.
* [ ] More friendly documentation.
