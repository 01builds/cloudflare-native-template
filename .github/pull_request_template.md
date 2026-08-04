# 📝 Pull Request Template

## Description
Provide a concise summary of the changes proposed in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Refactor (code structure reorganization with no functional changes)
- [ ] Documentation update

## Verification & Testing
Describe how these changes were tested (include local test runs or output).
- [ ] Verification test suite passes locally (`pnpm test`)
- [ ] Static type analysis checks pass (`pnpm typecheck`)
- [ ] Linter rules pass (`pnpm lint`)

## Edge Compatibility Checklist
- [ ] Avoided Node.js synchronous blocking APIs (e.g., `fs.readFileSync`).
- [ ] No hardcoded environment secrets (used `.dev.vars` / Wrangler bindings).
- [ ] Database schema changes generate matching migrations (`pnpm db:generate`).
- [ ] Enforced RPC type exports to frontend Client (`apps/web`).
