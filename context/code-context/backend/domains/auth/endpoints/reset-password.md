---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-09
method: POST
path: "/api/v1/auth/reset-password"
match_key: "POST /api/v1/auth/reset-password"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Reset Password

## Endpoint ID
EP-AUTH-09

## Summary
Set a new password with a valid reset token, end every other session and email a confirmation.

## Status
Proposed

## Method + Path
POST /api/v1/auth/reset-password

## Domain
auth

## Purpose
Set a new password with a valid reset token, end every other session and email a confirmation.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| token | string | yes |  | Confirmed |
| newPassword | string | yes | password policy BR-001 | Confirmed (BR-001) |


## Response
- `200 OK` -> `{ reset: true }` (user then signs in; no auto session)
- `400 TOKEN_INVALID` / `410 TOKEN_EXPIRED` -> client offers EP-AUTH-08
- `400 VALIDATION_ERROR` weak password

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

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- Email delivery via EP-NOTF-01

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Validate token (purpose `reset`, unused, unexpired), validate policy, update password hash, reset lockout counters.
- Revoke all sessions of the user (BR-028, DEC-053) and email a confirmation through EP-NOTF-01.

## Called by
- PAGE-AUTH-05 Reset Password - ../../../../../../../frontend/context/code-context/frontend/pages/auth/reset-password.md (frontend repo)

## Reads / Writes Entities
- Reads and writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)
- Writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)

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
- Business rules: BR-001, BR-005, BR-028
- Data: DATA-001, DATA-002, DATA-003
- Integrations: INT-001
- Decisions: DEC-079, DEC-080
