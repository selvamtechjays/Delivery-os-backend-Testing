---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-TASK-02
method: GET
path: "/api/v1/lists/:listId/tasks"
match_key: "GET /api/v1/lists/:P/tasks"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: tasks
source_reference: "src/tasks/tasks.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: List Tasks In A List

## Endpoint ID
EP-TASK-02

## Summary
Return a list's tasks in manual order or sorted as a view, optionally including completed tasks.

## Status
Proposed

## Method + Path
GET /api/v1/lists/:listId/tasks

## Domain
tasks

## Purpose
Return a list's tasks in manual order or sorted as a view, optionally including completed tasks.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| sort | enum manual\|dueDate\|priority | no (query) | default manual; sorting never changes stored order (BR-013) | Confirmed |
| includeCompleted | boolean | no (query) | default false (BR-012) | Confirmed |


## Response
- `200 OK` -> `{ tasks: Task[] }` each with `overdue` flag computed in the user's time zone (BR-014)
- `404 LIST_NOT_FOUND`

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
- `dueDate` sort: tasks without a due date last (BR-035); `priority` sort: high, medium, low, ties by manual position.
- Excludes soft-deleted tasks. No pagination in v1 (heavy user ~1,000 tasks, BR-016; DEC-076).

## Called by
- PAGE-TASK-01 Task List - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-list.md (frontend repo)

## Reads / Writes Entities
- Reads tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)
- Reads lists - ../../../../database/collections/lists.md (ENT-LIST-01)

## Integrations
- None

## Used by Features
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)
- FEAT-VIEW-01 Manual Ordering and Sorting
- FEAT-VIEW-02 Task Search, Filters and Completed Toggle

## Source Reference
- Planned file: `src/tasks/tasks.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/tasks/`)

## Open Questions
- None

## Source References
- Features: FEAT-TASK-01, FEAT-VIEW-01, FEAT-VIEW-02
- Workflows: WF-006, WF-007
- Business rules: BR-012, BR-013, BR-014, BR-035
- Data: DATA-005
- Integrations: None
- Decisions: DEC-076, DEC-083
