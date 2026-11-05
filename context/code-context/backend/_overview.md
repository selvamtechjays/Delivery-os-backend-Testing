---
doc_type: layer-overview
schema_version: 1.3
produced_by: tl
layer: backend
generated_at: 2026-11-05
---

# Backend Overview

## Stack
Node.js 22 + Express 5 + TypeScript (strict); Mongoose 9 on MongoDB; Jest + supertest (technology-stack.md, DEC-013, DEC-007).

## Conventions
`src/app.ts` builds the app (`createApp(corsOrigins, deps?)`); `src/server.ts` listens. One folder per domain (`src/<domain>/`: routes, service, model). Ports in `src/ports/` (Mailer, Clock, OAuthVerifier, Storage) isolate external systems (DEC-074). REST under `/api/v1`, JSON errors `{ error: { code, message } }` (DEC-076); `/health` stays at the root.

## Entry Points
`src/app.ts`, `src/routes/health.ts` (exists), planned `src/<domain>/<domain>.routes.ts`.

## Notes
Auth model: server-side opaque sessions in httpOnly cookies with double-submit CSRF (DEC-077); admin sessions use a separate cookie (DEC-078). Scheduled jobs (digest, purge, outbox retry) need a scheduler binding that is not yet chosen (OQ-NOTF-03).
