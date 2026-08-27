import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { edgeSecurity } from './core/middleware/security';
import { errorHandler } from './core/middleware/error';
import { healthRoute } from './features/health/health.route';
import { usersRoute } from './features/users/users.route';
import { storageRoute } from './features/storage/storage.route';
import { aiRoute } from './features/ai/ai.route';
import { authRoute } from './features/auth/auth.route';

type Env = {
  Bindings: EnvBindings;
};

const app = new Hono<Env>();

// Apply Middleware
app.use('*', cors());
app.use('*', edgeSecurity);
app.onError(errorHandler);

// Mount feature routes
const routes = app
  .route('/health', healthRoute)
  .route('/api/users', usersRoute)
  .route('/api/storage', storageRoute)
  .route('/api/ai', aiRoute)
  .route('/api/auth', authRoute);

export type AppType = typeof routes;
export default app;
