---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-11
method: POST
path: "/api/v1/auth/google/link-confirm"
match_key: "POST /api/v1/auth/google/link-confirm"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Confirm Google Account Link

## Endpoint ID
EP-AUTH-11

## Summary
Complete linking a Google identity to an existing email/password account after the user proves ownership of the email.

## Status
Proposed

## Method + Path
POST /api/v1/auth/google/link-confirm

## Domain
auth

## Purpose
Complete linking a Google identity to an existing email/password account after the user proves ownership of the email.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| token | string | yes | `google-link` token from the email | Assumed |


## Response
- `200 OK` -> `{ linked: true, user: Me }` and session cookies
- `400 TOKEN_INVALID` / `410 TOKEN_EXPIRED`

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

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Validate and consume the token, insert linked_identities row, mark email verified, start a session. No duplicate account is ever created (BR-029).

## Called by
- PAGE-AUTH-03 Verify Email - ../../../../../../../frontend/context/code-context/frontend/pages/auth/verify-email.md (frontend repo)

## Reads / Writes Entities
- Reads and writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)
- Writes linked_identities - ../../../../database/collections/linked-identities.md (ENT-AUTH-04)
- Writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)

## Integrations
- INT-002 (see shared-context/integrations.md)

## Used by Features
- FEAT-AUTH-04 Google Sign-in (Optional)

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- None

## Source References
- Features: FEAT-AUTH-04
- Workflows: WF-004
- Business rules: BR-029
- Data: DATA-001, DATA-003
- Integrations: INT-002
- Decisions: DEC-089
