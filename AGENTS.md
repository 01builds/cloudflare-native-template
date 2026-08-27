# 🤖 Policy — Master Operating Contract

## 1. System Architecture
- **Runtime Engine**: Cloudflare Workers (`workerd`) with `nodejs_compat` enabled.
- **API Gateway**: Hono.js inside `apps/api/src/index.ts`.
- **User Interface**: React 19 + Vite inside `apps/web` (served via Worker Assets).
- **Persistence Layer**: Cloudflare D1 + Drizzle ORM inside `packages/db`.
- **Verification Engine**: Vitest + `@cloudflare/vitest-pool-workers`.

## 2. Execution Constraints
1. **Asynchronous Non-Blocking I/O**: Only standard Fetch API or Cloudflare native bindings (`env.DB`, `env.CACHE_KV`, `env.STORAGE_R2`). Synchronous native Node.js calls (`fs`, `net`, `child_process`) are strictly forbidden.
2. **Type Safety & Transport**: Router type definitions MUST be exported from `apps/api` (`export type AppType = typeof routes`) and consumed by `apps/web/src/lib/api.ts` via `hc<AppType>()`.
3. **Database Mutations**: Schema changes MUST occur strictly within `packages/db/src/schema`. SQL migrations are generated via `pnpm --filter @template/db generate`. Direct manual edits to generated SQL files are prohibited.
4. **Secret Isolation**: Local development secrets belong exclusively in `.dev.vars` (git-ignored). Production secrets are set via `wrangler secret put`.

## 3. Package Topology & Boundaries
- `apps/web`: UI components, pages, state management, Hono RPC client (`hc<AppType>`).
- `apps/api`: Request routing, authentication, security middleware, edge handlers.
- `packages/domain`: Entities, value objects, Zod validation schemas.
- `packages/db`: Drizzle ORM schemas (`src/schema`), SQL migrations (`migrations/`), database seeders.

## 4. Agent Skill Mapping (`.agents/skills/`)
- `worker`: Guidance for Cloudflare Workers, Hono, Assets, KV, R2, Vectorize, and Workers AI.
- `database`: Directives for D1 Drizzle schemas, SQL migration workflows, and indexing strategies.
- `domain`: Rules for core business logic, entity boundaries, and validation schemas.
- `verification`: Instructions for `@cloudflare/vitest-pool-workers` unit and integration tests.
- `tpm`: Autonomous task decomposition, specification generation, and dependency management.
