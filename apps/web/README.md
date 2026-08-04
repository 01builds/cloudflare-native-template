# 🎨 Client UI Workspace

This package contains the React 19 single-page application served via **Cloudflare Workers Assets**.

## Features

- **React 19**: Modern UI rendering engine.
- **Vite 8**: Rapid local development server and build orchestrator.
- **Type-safe RPC Client**: Communicates with the backend gateway via Hono RPC `hc<AppType>()` utilizing shared route type definitions.

## Build & Deploy

- Run dev server: `pnpm dev`
- Build production assets: `pnpm build`
- Deploy to Cloudflare: `pnpm deploy` (runs wrangler deployment)
