# ⚡ Gateway Package

This package serves as the dynamic edge API router for the application, built with **Hono.js** and running on **Cloudflare Workers**.

## Routing Setup

All HTTP endpoints are declared in `src/index.ts` (and can be modularly split into `src/routes/`). 
Dynamic endpoints are routed under `/api/*` and the health check endpoint is at `/health`.

## Middleware

- `CORS`: Handles cross-origin requests.
- `Security Headers`: Injects standard headers (HSTS, CSP, X-Frame-Options) to protect HTTP traffic.
- `Error Handler`: Serializes unhandled edge exceptions into structured JSON responses.

## Tests

Integration tests are executed using `@cloudflare/vitest-pool-workers` inside Miniflare's isolated edge emulator environment.

Run verification:
```bash
pnpm test
```
