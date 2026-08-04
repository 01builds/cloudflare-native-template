# Cloudflare D1 & Drizzle ORM Skill

Guidance for managing database schemas, index strategy, and query migrations.

## Guidelines
1. **Schema Definition**: Place table definitions in `packages/db/src/schema/`. Always explicitly export relations.
2. **Migrations Workflow**:
   - Edit schema.
   - Run `pnpm db:generate` to produce new SQL files in `packages/db/migrations/`.
   - Never edit SQL migrations by hand.
3. **Execution**:
   - Dev: `pnpm db:migrate:local`
   - Prod: `pnpm db:migrate:prod`
4. **Client Initialization**: Use `drizzle(c.env.DB)` inside routes to query the database.
5. **Seeding**: Write seed mock data script in `packages/db/src/seed.ts`. Run with `pnpm seed`.
