---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-08
method: POST
path: "/api/v1/auth/forgot-password"
match_key: "POST /api/v1/auth/forgot-password"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Request Password Reset

## Endpoint ID
EP-AUTH-08

## Summary
Email a one-hour reset link if the account exists, always responding neutrally.

## Status
Proposed

## Method + Path
POST /api/v1/auth/forgot-password

## Domain
auth

## Purpose
Email a one-hour reset link if the account exists, always responding neutrally.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| email | string | yes |  | Confirmed |


## Response
- `202 Accepted` -> `{ sent: true }` regardless of whether the account exists (BR-026 neutral reset)
- `429 RATE_LIMITED`

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
- `RESET_TTL_MINUTES` - optional; default 60
- `APP_BASE_URL` - required; reset link base

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- Email delivery via EP-NOTF-01

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- If a user exists and is active (or unverified), invalidate earlier reset tokens and create a `reset` token valid 1 hour (BR-005), hand the email to EP-NOTF-01.
- Disabled or pending-deletion accounts get the same neutral 202 and no email.
- Repeated requests are throttled per email and per IP (limits Assumed).

## Called by
- PAGE-AUTH-04 Forgot Password - ../../../../../../../frontend/context/code-context/frontend/pages/auth/forgot-password.md (frontend repo)
- PAGE-AUTH-05 Reset Password - ../../../../../../../frontend/context/code-context/frontend/pages/auth/reset-password.md (frontend repo)

## Reads / Writes Entities
- Reads users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)

## Integrations
- INT-001 (see shared-context/integrations.md)

## Used by Features
- FEAT-AUTH-03 Password Recovery

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- None

## Source References
- Features: FEAT-AUTH-03
- Workflows: WF-003
- Business rules: BR-005, BR-026
- Data: DATA-003
- Integrations: INT-001
- Decisions: DEC-080
