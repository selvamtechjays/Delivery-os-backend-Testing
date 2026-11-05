---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-LIST-02
method: POST
path: "/api/v1/lists"
match_key: "POST /api/v1/lists"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: lists
source_reference: "src/lists/lists.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Create List

## Endpoint ID
EP-LIST-02

## Summary
Create a custom list (verified users only).

## Status
Proposed

## Method + Path
POST /api/v1/lists

## Domain
lists

## Purpose
Create a custom list (verified users only).

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| name | string | yes | non-empty, <= 100 chars, unique per user case-insensitively (BR-032, BR-045) | Confirmed |


## Response
- `201 Created` -> `{ list }` appended after the last custom list
- `400 VALIDATION_ERROR` (empty / too long)
- `409 LIST_NAME_TAKEN`
- `403 EMAIL_NOT_VERIFIED` -> a verified email is needed to create custom lists (BR-002)

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** Opaque 256-bit random session token (not a JWT); only its SHA-256 hash is stored in `sessions` (ENT-AUTH-02)
- **Verified by:** `requireSession` middleware (planned `src/auth/session.middleware.ts`): hash lookup, `revokedAt` null, `expiresAt` in the future, owning user `status = active`
- **Client obtains via:** `Set-Cookie` returned by `POST /api/v1/auth/signin` (EP-AUTH-04), `/auth/signup` (EP-AUTH-01), `/auth/google` (EP-AUTH-10) or `/auth/recover-account` (EP-PROF-08); the frontend always calls through `src/lib/api.ts` with `credentials: 'include'`
- **Header format:** `Cookie: tn_session=<token>` (httpOnly, Secure, SameSite=Lax); every non-GET request also sends `X-CSRF-Token: <value of the tn_csrf cookie>` (double-submit)
- **Server extracts:** `req.auth = { userId, sessionId, emailVerified, remember }`
- **Failure responses:**
  - 401 `SESSION_INVALID` (cookie missing, unknown, expired or revoked); 403 `CSRF_INVALID` (non-GET without matching `X-CSRF-Token`); 403 `ACCOUNT_DISABLED` (user status disabled, session revoked). Additionally 403 `EMAIL_NOT_VERIFIED` when the account is unverified.
- **Server prerequisites:** `cookie-parser`; CORS with `Access-Control-Allow-Credentials: true` and exact-origin match from `CORS_ORIGINS` (never `*`); reachable MongoDB; TTL index on `sessions.expiresAt`
- **Permissions layered on top of authentication:** Requires `emailVerified = true` (unverified users get 403 `EMAIL_NOT_VERIFIED`).

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
- Enforce unverified restriction server-side (DEC-088); no cap on number of lists in v1; 'My Tasks' reserved name is rejected for custom lists.

## Called by
- PAGE-LIST-01 Lists - ../../../../../../../frontend/context/code-context/frontend/pages/list/lists.md (frontend repo)

## Reads / Writes Entities
- Writes lists - ../../../../database/collections/lists.md (ENT-LIST-01)

## Integrations
- None

## Used by Features
- FEAT-LIST-01 List Management

## Source Reference
- Planned file: `src/lists/lists.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/lists/`)

## Open Questions
- None

## Source References
- Features: FEAT-LIST-01
- Workflows: WF-001
- Business rules: BR-002, BR-032, BR-045
- Data: DATA-004
- Integrations: None
- Decisions: DEC-088
