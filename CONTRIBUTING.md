# Contributing to Cloudflare Native Starter

We welcome contributions to keep this template secure, modern, and aligned with Cloudflare best practices.

## Contribution Workflow

### 1. File an Issue First
Before writing code, please open an issue describing your proposed change or bug fix. This ensures alignment on architecture and prevents redundant work.

### 2. Local Testing & Standards
Your changes must pass the project's quality gates. Run these checks locally before opening a pull request:

```bash
# Verify formatting and linter constraints
pnpm lint

# Verify type safety
pnpm typecheck

# Run verification test suite
pnpm test
```

### 3. Edge Compatibility Constraints
This template runs inside the Cloudflare Workers runtime. Ensure all code complies with the following runtime policies:
- Do not use blocking Node.js APIs (`fs`, `net`, `child_process`).
- Only use standard web APIs or Cloudflare bindings (`env.DB`, `env.CACHE_KV`).
- All HTTP endpoints in the gateway must maintain type safety with the client.
