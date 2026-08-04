// Cloudflare Worker Environment Bindings Declaration
declare global {
  interface EnvBindings {
    DB: D1Database;
    CACHE_KV: KVNamespace;
    STORAGE_R2: R2Bucket;
    AI: Ai;
    ENVIRONMENT: string;
  }
}

export {};
