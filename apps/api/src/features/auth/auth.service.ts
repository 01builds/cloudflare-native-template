import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins';
import { createDbClient } from '@template/db';
import * as authSchema from '@template/db';

export function createAuth(env: EnvBindings) {
  const db = createDbClient(env.DB);
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: authSchema,
    }),
    secret: env.AUTH_SECRET,
    baseURL: env.APP_URL,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      customRules: {
        '/sign-in/email': { window: 60, max: 5 },
        '/sign-up/email': { window: 60, max: 5 },
      },
    },
    advanced: {
      useSecureCookies: env.ENVIRONMENT === 'production',
      defaultCookieAttributes: {
        sameSite: 'lax',
        httpOnly: true,
      },
    },
    plugins: [
      twoFactor({
        issuer: 'CloudflareNativeStarter',
      }),
    ],
  });
}
