# API Reference

**Overview**

* `/db` - a simple database based on KV.
* `/mail` - send emails using [MailChannels](https://mailchannels.com/).
* `/cors` - CORS for any website.
* `/hook` - some webhook handlers.

`/hook` has no document.

## Authentication

Use basic authentication to access the APIs. The username and password are set in `src/config.ts`.

In the following examples, we emit the `Authorization` header for simplicity.

## Database based on KV

Every database has a `name`. Edit the mapping of `name` and KV in `src/config.ts`.

Any `value` is string.

### Get value with key

You can use both `GET` and `POST` to do this.

```http
POST /db/:name
Content-Type: application/json

{
  "action": "get",
  "key": "<string>"
}
```

```http
GET /db/:name/:key
```

Return on success

```json
{
  "key": "<string>",
  "value": "<string>" 
}
```

Return a 404 error if the key does not exist.

### Set value with key

```http
POST /db/:name
Content-Type: application/json

{
  "action": "put",
  "key": "<string>",
  "value": "<string>",
  "ttl": 30,
  "safe": true
}
```

* [Optional] `ttl` is the time to live in seconds. Default is infinite.
* [Optional] `safe` is a boolean. If `true`, the request will fail with 409 error if the key already exists. Default is `false`.

Return the `key`, `value` and `ttl` (if given) on success.

### Delete key

```http
POST /db/:name
Content-Type: application/json

{
  "action": "delete",
  "key": "<string>"
}
```

Return the same result as `GET`. If the key does not exist, return a 404 error.

### List keys

Take the given `key` as prefix and return all keys that match the prefix.

> Not tested yet.

```http
POST /db/:name
Content-Type: application/json

{
  "action": "list",
  "key": "<string>"
}
```

Return an array of keys on success.

## Send emails

The email service is based on [MailChannels](https://mailchannels.com/), and the API looks like the [MailChannels API](https://api.mailchannels.net/tx/v1/documentation).

However, there are some differences:
* the `from`, `subject`, `headers`, `reply_to` can only be set in root level, that is, it will be ignore in `personalizations`.
* `reply_to` is renamed to `replyTo`.
* DKIM settings will be overwritten by `src/config.ts`, which prevents you from putting you DKIM private key everywhere.
* If the domain of  `from` is not the one you set in `src/config.ts`, the request will fail with 403 error.

## CORS for any website

Request to `/cors?target=<url>` will be proxy to `<url>` with same method, body and headers.

Optionally, you can set query parameter `follow=false` to disable following redirects. In this case, the response will be the same as the first response. Default is `true`.

The response will be returned as is, except CORS headers.