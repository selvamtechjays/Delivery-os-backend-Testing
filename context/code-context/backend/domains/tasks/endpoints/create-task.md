---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-TASK-01
method: POST
path: "/api/v1/tasks"
match_key: "POST /api/v1/tasks"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: tasks
source_reference: "src/tasks/tasks.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Create Task (Quick Add)

## Endpoint ID
EP-TASK-01

## Summary
Create a task at the top of a list from a title (and optional fields); enforces the unverified 5-task cap.

## Status
Proposed

## Method + Path
POST /api/v1/tasks

## Domain
tasks

## Purpose
Create a task at the top of a list from a title (and optional fields); enforces the unverified 5-task cap.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| listId | string | yes | owned list | Confirmed |
| title | string | yes | 1-200 chars after trim; blank is rejected (BR-034) | Confirmed |
| notes | string | no | <= 2000 chars | Confirmed (BR-034) |
| dueDate | date (YYYY-MM-DD) | no | past dates allowed (BR-034) | Confirmed |
| dueTime | time (HH:mm) | no | only allowed when dueDate is set (BR-034, BR-036) | Confirmed |
| priority | enum low\|medium\|high | no | default medium (BR-035) | Confirmed |
| clientId | string (uuid) | no | idempotency key for optimistic create retries | Assumed |


## Response
- `201 Created` -> `{ task }` positioned at the top of the list (BR-036)
- `400 VALIDATION_ERROR`
- `404 LIST_NOT_FOUND`
- `403 TASK_LIMIT_UNVERIFIED` -> `{ limit: 5 }`; client offers EP-AUTH-03 resend (BR-027)

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
- Count the user's non-deleted tasks when unverified; refuse at 5 (counting rule pending CLR-037). No cap for verified users (BR-016).
- `position = min(position in list) - 1` so the new task sorts first (DEC-083).
- The client reports the 'task created' analytics event after consent (no server call).

## Called by
- PAGE-TASK-01 Task List - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-list.md (frontend repo)

## Reads / Writes Entities
- Writes tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)
- Reads lists - ../../../../database/collections/lists.md (ENT-LIST-01)
- Reads users - ../../../../database/collections/users.md (ENT-AUTH-01)

## Integrations
- None

## Used by Features
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)

## Source Reference
- Planned file: `src/tasks/tasks.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/tasks/`)

## Open Questions
- CLR-037 | How is the 5-task cap counted (completed? soft-deleted?) | BA | Assumed: all non-deleted tasks incl. completed | Open

## Source References
- Features: FEAT-TASK-01
- Workflows: WF-006
- Business rules: BR-010, BR-016, BR-027, BR-034, BR-035, BR-036
- Data: DATA-005
- Integrations: None
- Decisions: DEC-082, DEC-083, DEC-088
