import { Hono } from 'hono';

export const healthRoute = new Hono<{ Bindings: EnvBindings }>()
  .get('/', (c) => {
    return c.json({
      status: 'ok',
      environment: c.env.ENVIRONMENT || 'production',
      timestamp: new Date().toISOString(),
    });
  });
