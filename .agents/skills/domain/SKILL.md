# Domain Model Skill

Guidance for writing core business rules, entity models, and input validation schemas.

## Guidelines
1. **Core Entities**: Place core TypeScript interfaces and business invariants in `packages/domain/src/types.ts`.
2. **Validation**: Use Zod schemas in `packages/domain/src/validators.ts` for data contract validation.
3. **Validation Middleware**: Import Zod schemas in `packages/gateway` and wrap routes using Hono's `zValidator`.
4. **Shared Imports**: Frontend Client (`apps/web`) uses validation schemas from `@template/domain` to handle client-side form validation.
