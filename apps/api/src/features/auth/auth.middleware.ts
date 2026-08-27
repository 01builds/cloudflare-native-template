import { createMiddleware } from 'hono/factory';
import { createAuth } from './auth.service';

type UserSession = Awaited<ReturnType<ReturnType<typeof createAuth>['api']['getSession']>>;

export type AuthContext = {
  Variables: {
    user: NonNullable<UserSession>['user'] | null;
    session: NonNullable<UserSession>['session'] | null;
  };
};

export const optionalAuth = createMiddleware<{
  Bindings: EnvBindings;
  Variables: {
    user: NonNullable<UserSession>['user'] | null;
    session: NonNullable<UserSession>['session'] | null;
  };
}>(async (c, next) => {
  const auth = createAuth(c.env);
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (sessionData) {
    c.set('user', sessionData.user);
    c.set('session', sessionData.session);
  } else {
    c.set('user', null);
    c.set('session', null);
  }

  await next();
});

export const requireAuth = createMiddleware<{
  Bindings: EnvBindings;
  Variables: {
    user: NonNullable<UserSession>['user'];
    session: NonNullable<UserSession>['session'];
  };
}>(async (c, next) => {
  const auth = createAuth(c.env);
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!sessionData) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', sessionData.user);
  c.set('session', sessionData.session);

  await next();
});
