import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { createDbClient, users } from '@template/db';
import { CreateUserSchema } from '@template/domain';
import { edgeSecurity } from './middleware/security';
import { errorHandler } from './middleware/error';

type Env = {
  Bindings: EnvBindings;
};

const app = new Hono<Env>();

// Apply Middleware
app.use('*', cors());
app.use('*', edgeSecurity);
app.onError(errorHandler);

// Global Routes
const routes = app
  .get('/health', (c) => {
    return c.json({
      status: 'ok',
      environment: c.env.ENVIRONMENT || 'production',
      timestamp: new Date().toISOString(),
    });
  })
  .get('/api/users', async (c) => {
    const db = createDbClient(c.env.DB);
    const result = await db.query.users.findMany();
    return c.json({ data: result });
  })
  .post('/api/users', zValidator('json', CreateUserSchema), async (c) => {
    const body = c.req.valid('json');
    const db = createDbClient(c.env.DB);
    const userId = crypto.randomUUID();

    const newUser = {
      id: userId,
      email: body.email,
      name: body.name || null,
      createdAt: new Date().toISOString(),
    };

    await db.insert(users).values(newUser);
    return c.json({ data: newUser }, 201);
  });

export type AppType = typeof routes;
export default app;
