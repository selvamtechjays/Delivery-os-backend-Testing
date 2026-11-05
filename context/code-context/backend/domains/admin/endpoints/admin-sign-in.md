---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-ADMN-01
method: POST
path: "/api/v1/admin/auth/signin"
match_key: "POST /api/v1/admin/auth/signin"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: admin
source_reference: "src/admin/admin.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Admin Sign In

## Endpoint ID
EP-ADMN-01

## Summary
Dedicated sign-in for admin accounts (separate from user accounts).

## Status
Proposed

## Method + Path
POST /api/v1/admin/auth/signin

## Domain
admin

## Purpose
Dedicated sign-in for admin accounts (separate from user accounts).

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| email | string | yes |  | Confirmed (BR-037) |
| password | string | yes |  | Confirmed |


## Response
- `200 OK` -> `{ admin: { id, name, email, role } }` + Set-Cookie `tn_admin_session` (Path=/api/v1/admin) + `tn_csrf`
- `401 INVALID_CREDENTIALS`

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** None (public endpoint)
- **Verified by:** n/a; abuse controls only (state-changing requests must carry an `Origin` header matching `CORS_ORIGINS`; rate limiting where stated in Behaviour)
- **Client obtains via:** n/a
- **Header format:** none required
- **Server extracts:** n/a
- **Failure responses:**
  - 403 `ORIGIN_NOT_ALLOWED` (state-changing request from a non-allowed origin); 429 `RATE_LIMITED` where throttled
- **Server prerequisites:** CORS configured with `CORS_ORIGINS`
- **Permissions layered on top of authentication:** None

Confidence: Confirmed (public by feature definition).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `CORS_ORIGINS` - required (exists in scaffold)
- `MONGODB_URI` - required where the endpoint touches data
- `ADMIN_SESSION_TTL_HOURS` - optional; default 8 (Assumed)

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Looks only in admin_accounts; a regular user can never obtain an admin session (BR-037).
- Session TTL 8 hours (Assumed); no remember-me for admins.
- Lockout/throttling not specified for admins (OQ-AUTH-05).

## Called by
- PAGE-ADMN-01 Admin Sign In - ../../../../../../../frontend/context/code-context/frontend/pages/admin/admin-sign-in.md (frontend repo)

## Reads / Writes Entities
- Reads admin_accounts - ../../../../database/collections/admin-accounts.md (ENT-ADMN-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)

## Integrations
- None

## Used by Features
- FEAT-ADMN-01 Admin Access and Roles

## Source Reference
- Planned file: `src/admin/admin.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/admin/`)

## Open Questions
- OQ-AUTH-05 | Lockout / throttling policy for admin sign-in (BR-004 covers users only) | BA / Security | Admin brute-force defence | Open

## Source References
- Features: FEAT-ADMN-01
- Workflows: WF-009
- Business rules: BR-037
- Data: None
- Integrations: None
- Decisions: DEC-078
