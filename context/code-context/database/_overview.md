---
doc_type: layer-overview
schema_version: 1.3
produced_by: tl
layer: database
generated_at: 2026-11-05
---

# Database Overview

## Stack
MongoDB via Mongoose (DEC-007). Test DB: mongodb-memory-server 7.0.14 (DEC-071). Production version and hosting region undecided (OQ-UXP-01; EU region required, BR-030).

## Conventions
One Mongoose model per collection in the owning domain folder (`src/<domain>/<name>.model.ts`). Collections are files under `collections/`. TTL indexes handle expiry (sessions, tokens, soft-deleted tasks, outbox).

## Entry Points
`src/db/mongo.ts` (connection, exists). Models are planned, not yet written.

## Kinds present
Collections only. No tables, views, procedures, functions or triggers.

## Notes
Embedded subdocuments: `users.preferences` (DATA-007) and `tasks.checklist` (DATA-006), DEC-081.
