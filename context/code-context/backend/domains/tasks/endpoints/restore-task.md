---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-TASK-06
method: POST
path: "/api/v1/tasks/:taskId/restore"
match_key: "POST /api/v1/tasks/:P/restore"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: tasks
source_reference: "src/tasks/tasks.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Undo Task Deletion

## Endpoint ID
EP-TASK-06

## Summary
Restore a just-deleted task within the 10-second Undo window.

## Status
Proposed

## Method + Path
POST /api/v1/tasks/:taskId/restore

## Domain
tasks

## Purpose
Restore a just-deleted task within the 10-second Undo window.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
None (no request body or parameters).

## Response
- `200 OK` -> `{ task }` in its original list and position
- `404 TASK_NOT_FOUND`
- `410 UNDO_EXPIRED` window elapsed (BR-011)

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** Opaque 256-bit random session token (not a JWT); only its SHA-256 hash is stored in `sessions` (ENT-AUTH-02)
- **Verified by:** `requireSession` middleware (planned `src/auth/session.middleware.ts`): hash lookup, `revokedAt` null, `expiresAt` in the future, owning user `status = active`
- **Client obtains via:** `Set-Cookie` returned by `POST /api/v1/auth/signin` (EP-AUTH-04), `/auth/signup` (EP-AUTH-01), `/auth/google` (EP-AUTH-10) or `/auth/recover-account` (EP-PROF-08); the frontend always calls through `src/lib/api.ts` with `credentials: 'include'`
- **Header format:** `Cookie: tn_session=<token>` (httpOnly, Secure, SameSite=Lax); every non-GET request also sends `X-CSRF-Token: <value of the tn_csrf cookie>` (double-submit)
- **Server extracts:** `req.auth = { userId, sessionId, emailVerified, remember }`
- **Failure responses:**
  - 401 `SESSION_INVALID` (cookie missing, unknown, expired or revoked); 403 `CSRF_INVALID` (non-GET without matching `X-CSRF-Token`); 403 `ACCOUNT_DISABLED` (user status disabled, session revoked).
- **Server prerequisites:** `cookie-parser`; CORS with `Access-Control-Allow-Credentials: true` and exact-origin match from `CORS_ORIGINS` (never `*`); reachable MongoDB; TTL index on `sessions.expiresAt`
- **Permissions layered on top of authentication:** Any signed-in user (verified or unverified) unless stated in Behaviour.

Confidence: Assumed (design, DEC-077). Cross-origin cookie behaviour depends on frontend and API sharing a registrable domain (OQ-AUTH-01).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `MONGODB_URI` - required (exists in scaffold); sessions and domain data
- `CORS_ORIGINS` - required (exists in scaffold); exact frontend origin(s) for credentialed CORS
- `COOKIE_DOMAIN` - required in deployed envs (new); shared registrable domain for `tn_session` / `tn_csrf` (OQ-AUTH-01)
- `COOKIE_SECURE` - optional; default true outside local dev (new)

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Valid only if `deletedAt` is within 10 seconds; clears `deletedAt` and `purgeAt`. Undo covers task deletion only in v1.

## Called by
- PAGE-TASK-01 Task List - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-list.md (frontend repo)
- PAGE-TASK-02 Task Detail - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-detail.md (frontend repo)

## Reads / Writes Entities
- Writes tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)

## Integrations
- None

## Used by Features
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)

## Source Reference
- Planned file: `src/tasks/tasks.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/tasks/`)

## Open Questions
- None

## Source References
- Features: FEAT-TASK-01
- Workflows: WF-006
- Business rules: BR-011
- Data: DATA-005
- Integrations: None
- Decisions: DEC-082
