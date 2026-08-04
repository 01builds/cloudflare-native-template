# Cloudflare Native Template

A production-ready, globally distributed fullstack monorepo starter designed for the Cloudflare edge native ecosystem.

## Features

- **Frontend (`apps/web`)**: React 19 + Vite SPA served via Cloudflare Workers Assets.
- **API Router (`packages/gateway`)**: Hono.js inside Workers with zero-cold-start routing and dynamic middleware.
- **Relational Persistence (`packages/db`)**: Cloudflare D1 Serverless SQLite integrated with Drizzle ORM.
- **Type Transport**: End-to-end type safety between backend and frontend via Hono RPC `hc<AppType>()`.
- **Global Storage**: Object Store (`Storage`) on Cloudflare R2 and Key-Value Cache (`Cache`) on Cloudflare KV.
- **Edge Inference**: Workers AI models (embeddings, text generation) and Vectorize index integration.
- **Verification (`packages/gateway/test`)**: Testing directly inside the `workerd` runtime with `@cloudflare/vitest-pool-workers`.
- **Policy Control (`AGENTS.md`)**: Embedded AI agent constraints to enforce edge runtime patterns.

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Cloudflare Account & Wrangler CLI (`pnpm add -g wrangler`)

### Installation & Onboarding

1. Clone the repository and initialize workspace dependencies:
   ```bash
   pnpm install
   ```

2. Setup environment credentials:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

3. Run local database migrations & generate client bindings:
   ```bash
   pnpm db:generate
   pnpm db:migrate:local
   ```

4. Populate local database with seed data:
   ```bash
   pnpm seed
   ```

5. Launch local development server:
   ```bash
   pnpm dev
   ```

## Development Commands

- `pnpm dev`: Launch concurrent client & gateway hot-reloaded environments.
- `pnpm build`: Compile client assets and backend worker.
- `pnpm typecheck`: Execute TypeScript type audits across all packages.
- `pnpm test`: Execute Vitest integration test suite inside native workerd pool.
- `pnpm db:generate`: Generate SQL migration files from Drizzle schema edits.
- `pnpm db:migrate:local`: Apply SQL migrations to the local D1 instance.
- `pnpm db:migrate:prod`: Deploy pending migrations to Cloudflare's production D1 network.
- `pnpm deploy`: Bundle assets and deploy full stack to the edge.

## Architecture Guidelines

Review `AGENTS.md` at the root of the workspace for runtime limitations, folder topology, and code styling guardrails.
