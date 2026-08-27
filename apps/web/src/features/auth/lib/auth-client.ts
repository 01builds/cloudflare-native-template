import { createAuthClient } from 'better-auth/react';
import { twoFactorClient } from 'better-auth/plugins';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
  plugins: [twoFactorClient()],
});
