# 🗄️ Database Persistence Package

This package manages the relational schema definition, database migration lifecycle, and query clients using **Drizzle ORM** and **Cloudflare D1**.

## Database Schema

Table structures are defined under `src/schema/`. Export schemas inside `src/schema/index.ts` to expose them to query engines.

## Migrations Workflow

1. Edit schemas in `src/schema/`.
2. Generate SQL migration files:
   ```bash
   pnpm generate
   ```
3. Deploy migrations:
   - **Local Dev**: `pnpm db:migrate:local` (runs on Miniflare D1 emulator)
   - **Production Edge**: `pnpm db:migrate:prod` (runs on Cloudflare's D1 network)
