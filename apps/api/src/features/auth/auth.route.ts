import { Hono } from 'hono';
import { createAuth } from './auth.service';
import { requireAuth } from './auth.middleware';

type Env = {
  Bindings: EnvBindings;
};

export const authRoute = new Hono<Env>()
  .get('/me', requireAuth, (c) => {
    return c.json({
      user: c.get('user'),
      session: c.get('session'),
    });
  })
  .on(['GET', 'POST'], '/*', (c) => {
    return createAuth(c.env).handler(c.req.raw);
  });
