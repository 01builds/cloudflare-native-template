# 🏛️ Cloudflare Native Starter Template

A production-grade, globally distributed full-stack monorepo template built for the **Cloudflare edge-native ecosystem**. 

Designed for **Type-Safe Gateway Routing (Hono.js)**, **Native Web Asset Hosting (Workers Assets)**, **Relational Persistence (D1 + Drizzle)**, and **Autonomous Developer Agent Governance**.

---

## ⚡ Technical Stack & Version Specifications

| Component | Technology | Version | Description |
| :--- | :--- | :---: | :--- |
| **Engine** | Node.js | `v24` (LTS) | Stable enterprise JS runtime environment. |
| **Monorepo** | pnpm Workspaces | `v9` | Fast, disk-efficient package management. |
| **Pipeline** | Turborepo | `v2.10.8` | Monorepo caching task runner. |
| **User Interface** | React | `v19.2.8` | Client application serving interactive views. |
| **Bundler** | Vite | `v8.2.0` | Next-generation frontend build tooling. |
| **Gateway Router** | Hono.js | `v4.13.0` | Lightweight router executing inside Worker environment. |
| **Persistence ORM** | Drizzle ORM | `v0.45.2` | Type-safe relational mapping layer. |
| **Database** | Cloudflare D1 | — | Serverless SQLite relational database. |
| **Verification Pool** | Vitest | `v4.1.10` | Native runtime test suite execution using `workerd`. |

---

## 📂 Repository Topology

- **`apps/web`**: Client interface. Built to static files and served natively via Cloudflare Workers Assets.
- **`packages/gateway`**: Worker API router. Entrypoint Hono application handling endpoints under `/api/*` and security policies.
- **`packages/db`**: Persistence package. Declares schema definitions, migrations, and seeder modules.
- **`packages/domain`**: Business logic. Declares entities, models, and shared validation contracts.
- **`AGENTS.md`**: Central repository operating policy directing autonomous coding tools.

---

## 🚀 Getting Started

### 1. Prerequisites

Verify Node.js version matches target constraints:
```bash
node --version # Must be >= 24.0.0
```

Ensure Wrangler CLI is installed:
```bash
pnpm add -g wrangler
```

### 2. Workspace Initialization

Clone the template and install project-wide dependencies:
```bash
pnpm install
```

Configure your local secrets layout:
```bash
cp .dev.vars.example .dev.vars
```

### 3. Database Set up & Migrations

Local database migrations are run against Miniflare's local emulator instance:

```bash
# Generate SQL migration scripts from schemas
pnpm db:generate

# Apply migrations to the local D1 SQLite database
pnpm db:migrate:local

# Populate the local database with mock seed data
pnpm seed
```

### 4. Running Local Development

Launch concurrent watch servers for the gateway router, local emulator bindings, and client interface:
```bash
pnpm dev
```

Your web application will be accessible at `http://localhost:3000`.

---

## 🛠️ Developer Command Registry

| Command | Action Scope |
| :--- | :--- |
| `pnpm dev` | Start local client & gateway dev server. |
| `pnpm build` | Compile the Client assets and Gateway worker entrypoints. |
| `pnpm typecheck` | Run type checking audits across the entire workspace. |
| `pnpm test` | Run isolated Vitest tests inside Cloudflare's native `workerd` runtime. |
| `pnpm db:generate` | Inspect schemas and write new SQL migration outputs. |
| `pnpm db:migrate:local` | Deploy migration files to the local SQLite D1 emulator. |
| `pnpm db:migrate:prod` | Deploy migration files to the production Cloudflare D1 environment. |
| `pnpm deploy` | Build UI assets and deploy the Gateway to Cloudflare Edge. |

---

## 🛡️ Edge Security & Routing Guardrails

> [!IMPORTANT]
> **API Routing Scopes**: The Client routes dynamic requests to the Gateway via `/api/*`. Do not define generic root paths inside `packages/gateway` that overlap static assets unless registered inside `run_worker_first` in `wrangler.jsonc`.

> [!WARNING]
> **Edge Compatibility**: Avoid native Node.js APIs (e.g. `fs`, `net`, `child_process`). Always use standard Web APIs or Cloudflare bindings (`env.DB`, `env.CACHE_KV`).

---

## 🤖 Agent Governance Policy
Before executing code modifications, AI coding assistants must review the **`AGENTS.md`** file located at the root of the workspace. This file establishes coding guidelines, validation procedures, and quality metrics that must be satisfied.
