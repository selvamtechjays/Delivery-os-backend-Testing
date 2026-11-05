---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-VIEW-01
method: GET
path: "/api/v1/search/tasks"
match_key: "GET /api/v1/search/tasks"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: views
source_reference: "src/views/views.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Search Tasks

## Endpoint ID
EP-VIEW-01

## Summary
Search the user's tasks across all lists by title and notes.

## Status
Proposed

## Method + Path
GET /api/v1/search/tasks

## Domain
views

## Purpose
Search the user's tasks across all lists by title and notes.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| q | string | yes (query) | 1-100 chars, case-insensitive substring | Confirmed (BR-023) |
| includeCompleted | boolean | no (query) | default false (BR-012) | Confirmed |


## Response
- `200 OK` -> `{ tasks: Task[] }` each with `listId, listName`; empty array means the empty state
- `400 VALIDATION_ERROR`

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
- Owner-scoped, excludes soft-deleted. Matches title and notes (notes 'if possible', BR-023). Text index vs regex scan decided at build; ~1,000 tasks per user keeps either viable.

## Called by
- PAGE-VIEW-01 Smart Views And Search - ../../../../../../../frontend/context/code-context/frontend/pages/view/smart-views-and-search.md (frontend repo)

## Reads / Writes Entities
- Reads tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)
- Reads lists - ../../../../database/collections/lists.md (ENT-LIST-01)

## Integrations
- None

## Used by Features
- FEAT-VIEW-02 Task Search, Filters and Completed Toggle

## Source Reference
- Planned file: `src/views/views.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/views/`)

## Open Questions
- None

## Source References
- Features: FEAT-VIEW-02
- Workflows: WF-007
- Business rules: BR-023
- Data: DATA-005
- Integrations: None
- Decisions: None
