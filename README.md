# Delivery OS — Backend

Backend REST API for Delivery OS. Stack: **Node.js + Express 5 + TypeScript (strict) + MongoDB via Mongoose**, npm, Node 22+.

Frontend: https://github.com/selvamtechjays/Delivery-os-frontend-testing

## Getting started

```bash
npm install
cp .env.example .env     # set MONGODB_URI, PORT, CORS_ORIGINS
npm run dev              # http://localhost:3000/health
```

The server starts even when MongoDB is unreachable; `GET /health` returns
`{ "status": "ok", "db": "connected" | "disconnected" }`. Build, lint, type-check
and tests never connect to a database.

> A `MONGODB_URI` set in your OS environment overrides `.env` (dotenv does not
> override existing variables).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Run with auto-reload (`tsx watch src/server.ts`) |
| `npm run build` | Compile to `dist/` (`tsc -p tsconfig.build.json`) |
| `npm start` | Run the built app (`node dist/server.js`) |
| `npm run lint` | ESLint (typescript-eslint, type-checked) + Prettier rules, zero warnings |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm test` | Jest + supertest (`src/**/*.spec.ts`) |

## Layout

```
src/
  server.ts            entry: listen on PORT, connect MongoDB
  app.ts               createApp(): Express app, CORS, routes (no listen; used by tests)
  config/env.ts        reads PORT, MONGODB_URI, CORS_ORIGINS (dotenv)
  db/mongo.ts          Mongoose connection helpers
  routes/health.ts     GET /health
```

New features go in `src/<domain>/` (router, service, Mongoose model, specs) and are mounted in `app.ts`.
Conventions: see the workspace `.jetrix/shared-context/coding-standards.md`.
