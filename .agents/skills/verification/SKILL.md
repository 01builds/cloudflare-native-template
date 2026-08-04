# Testing & Verification Skill

Guidance for writing unit, mock, and integration test suites using Vitest and workerd.

## Guidelines
1. **Isolated Testing environment**: Running tests requires `@cloudflare/vitest-pool-workers`.
2. **Setup**: The configuration file is `packages/gateway/vitest.config.ts`.
3. **Database Test isolation**: D1 databases in tests execute migrations dynamically and run each test case in a separate sandbox.
4. **Mock Bindings**: Access simulated bindings directly via `import { env } from "cloudflare:workers"`.
5. **Execution**: Run test suites using `pnpm test`.
