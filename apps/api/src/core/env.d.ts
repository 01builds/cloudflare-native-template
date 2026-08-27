interface EnvBindings {
  DB: D1Database;
  CACHE_KV: KVNamespace;
  STORAGE_R2: R2Bucket;
  AI: Ai;
  ENVIRONMENT: string;
  AUTH_SECRET: string;
  APP_URL?: string;
}

declare module 'cloudflare:workers' {
  interface ProvidedEnv extends EnvBindings {}
}
