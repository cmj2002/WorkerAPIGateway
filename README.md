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
5. Other customizations (project name in `wrangler.toml`, HTML for `/` in `src/index.ts`, etc).
6. Run `npm run deploy`.

## TODO

* [ ] Add more APIs.
* [ ] Allow setting public access in config.
