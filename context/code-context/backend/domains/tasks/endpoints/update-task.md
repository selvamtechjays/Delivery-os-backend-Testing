---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-TASK-04
method: PATCH
path: "/api/v1/tasks/:taskId"
match_key: "PATCH /api/v1/tasks/:P"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: tasks
source_reference: "src/tasks/tasks.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Update Task (Edit, Complete, Move)

## Endpoint ID
EP-TASK-04

## Summary
Partially update a task: title, notes, due date/time, priority, completion state, or the list it belongs to.

## Status
Proposed

## Method + Path
PATCH /api/v1/tasks/:taskId

## Domain
tasks

## Purpose
Partially update a task: title, notes, due date/time, priority, completion state, or the list it belongs to.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| title | string | no | 1-200 | Confirmed |
| notes | string | no | <= 2000 | Confirmed |
| dueDate | date\|null | no | null clears; clearing also clears dueTime | Confirmed |
| dueTime | time\|null | no | only with a due date (BR-034) | Confirmed |
| priority | enum\|no\|low | medium | high | Confirmed |
| completed | boolean | no | true sets `completedAt`; false reopens (TASK-UC-03) | Confirmed |
| listId | string | no | owned list; moves the task (TASK-UC-05); task lands at the top of the target list | Assumed |


## Response
- `200 OK` -> `{ task }`
- `400 VALIDATION_ERROR` (blank title etc.)
- `404 TASK_NOT_FOUND` / `LIST_NOT_FOUND`

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
- Single idempotent PATCH used by optimistic UI; the client rolls back on any non-2xx (BR-021).
- A task belongs to exactly one list at all times (BR-009). Past due dates mark the task overdue (BR-014).
- Completing a task keeps it (hidden by default, never auto-deleted, BR-012).

## Called by
- PAGE-TASK-01 Task List - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-list.md (frontend repo)
- PAGE-TASK-02 Task Detail - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-detail.md (frontend repo)
- PAGE-VIEW-01 Smart Views And Search - ../../../../../../../frontend/context/code-context/frontend/pages/view/smart-views-and-search.md (frontend repo)

## Reads / Writes Entities
- Writes tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)
- Reads lists - ../../../../database/collections/lists.md (ENT-LIST-01)

## Integrations
- None

## Used by Features
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)
- FEAT-VIEW-02 Task Search, Filters and Completed Toggle

## Source Reference
- Planned file: `src/tasks/tasks.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/tasks/`)

## Open Questions
- None

## Source References
- Features: FEAT-TASK-01, FEAT-VIEW-02
- Workflows: WF-006
- Business rules: BR-009, BR-010, BR-012, BR-014, BR-021, BR-034
- Data: DATA-005
- Integrations: None
- Decisions: DEC-082
