---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-02
method: POST
path: "/api/v1/auth/verify-email"
match_key: "POST /api/v1/auth/verify-email"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Verify Email / Confirm Email Change

## Endpoint ID
EP-AUTH-02

## Summary
Consume a single-use email token to mark the account email verified, or to switch the account email after an email-change request.

## Status
Proposed

## Method + Path
POST /api/v1/auth/verify-email

## Domain
auth

## Purpose
Consume a single-use email token to mark the account email verified, or to switch the account email after an email-change request.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| token | string | yes | raw token from the emailed link; compared by SHA-256 hash | Confirmed (BR-002) |


## Response
- `200 OK` -> `{ purpose: 'verify'|'email-change', emailVerified: true, email }`
- `400 TOKEN_INVALID` unknown or already used
- `410 TOKEN_EXPIRED` older than 24h (BR-002); client offers EP-AUTH-03 resend
- `409 EMAIL_REGISTERED` (purpose email-change only) the new address was taken in the meantime; change refused (PROF-UC-03)

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** Single-use emailed token (256-bit random, stored only as SHA-256 hash in `email_tokens`, ENT-AUTH-03); request itself is unauthenticated
- **Verified by:** hash lookup in `email_tokens` for the expected purpose: unused and unexpired
- **Client obtains via:** the link in the email, parsed from the page URL query by the frontend page and posted in the JSON body
- **Header format:** none; the token travels in the request body (`token` field)
- **Server extracts:** `tokenRecord.userId`, `purpose`, `pendingEmail`
- **Failure responses:**
  - 400 `TOKEN_INVALID` (unknown or already used); 410 `TOKEN_EXPIRED`; 403 `ORIGIN_NOT_ALLOWED`
- **Server prerequisites:** reachable MongoDB; CORS configured with `CORS_ORIGINS`
- **Permissions layered on top of authentication:** None

Confidence: Assumed (DEC-080).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `CORS_ORIGINS` - required
- `MONGODB_URI` - required
- `EMAIL_VERIFY_TTL_HOURS` - optional; default 24

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Look up token hash in email_tokens with purpose in (`verify`, `email-change`); check unused and unexpired; mark used.
- `verify`: set `emailVerified:true`, `verifiedAt`. Unverified limits lift immediately (BR-002).
- `email-change`: re-check uniqueness, set `email` to the pending address, keep the account verified (BR-006).
- Other devices pick up the new state on their next EP-AUTH-07 poll (no push channel, architecture.md).

## Called by
- PAGE-AUTH-03 Verify Email - ../../../../../../../frontend/context/code-context/frontend/pages/auth/verify-email.md (frontend repo)

## Reads / Writes Entities
- Reads and writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)
- Writes users - ../../../../database/collections/users.md (ENT-AUTH-01)

## Integrations
- None

## Used by Features
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-PROF-01 Profile Management

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- None

## Source References
- Features: FEAT-AUTH-01, FEAT-PROF-01
- Workflows: WF-001, WF-005
- Business rules: BR-002, BR-006, BR-027
- Data: DATA-001, DATA-003
- Integrations: None
- Decisions: DEC-080
