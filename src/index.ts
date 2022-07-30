import { Hono } from 'hono'
import { authMiddleware } from './auth/middleware'
import { Env } from './types';
import { db } from './routes/db';
import { mail } from './routes/mail';

const app = new Hono<Env>();

app.get('/', async (c) => c.html('<h1>API Gateway for CMJ</h1>'))

// [Custom middleware] Auth
app.use('*', authMiddleware)


// Nested route
app.route('/db', db)
app.route('/mail', mail)

app.notFound(async (c) => c.json({ error: 'Not such route' }, 404))
app.onError((err, c) => c.json({ error: err.message }, 500))

export default app
