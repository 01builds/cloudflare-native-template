# Cloudflare Worker Developer Skill

Guidance for writing, configuring, and deploying Cloudflare Workers and Hono.js.

## Guidelines
1. **Request Routing**: Use Hono.js router inside `packages/gateway/src/index.ts`. Keep route modularity by splitting routes into `/routes` subdirectory.
2. **Workers Assets**: Serve client assets from apps/web. Do not add routing rules inside Hono that collide with static files unless explicitly specified in `run_worker_first`.
3. **Environment Bindings**: Bindings are accessible on `c.env`. Update `worker-configuration.d.ts` when introducing new bindings.
4. **KV Namespace Usage**:
   - Access: `c.env.CACHE_KV`
   - Use for quick reads, caching, sessions.
5. **R2 Bucket Usage**:
   - Access: `c.env.STORAGE_R2`
   - Use for binary uploads, images.
6. **Workers AI & Vectorize**:
   - Access: `c.env.AI`
   - Use for text generation, translation, image processing, or vector lookup.
