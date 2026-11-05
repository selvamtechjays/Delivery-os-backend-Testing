---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-01
method: POST
path: "/api/v1/auth/signup"
match_key: "POST /api/v1/auth/signup"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Sign Up With Email

## Endpoint ID
EP-AUTH-01

## Summary
Create an unverified account from name, email and password, create the default 'My Tasks' list, start a session and send the verification email.

## Status
Proposed

## Method + Path
POST /api/v1/auth/signup

## Domain
auth

## Purpose
Create an unverified account from name, email and password, create the default 'My Tasks' list, start a session and send the verification email.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| name | string | yes | 1-100 chars, trimmed | Assumed |
| email | string | yes | valid email, lower-cased; disposable domains rejected (BR-026) | Confirmed (BR-026) |
| password | string | yes | min 8 chars, not in common-password list, no composition rules (BR-001) | Confirmed (BR-001) |
| acceptedTerms | boolean | yes | must be true (BR-007); server stores acceptance timestamp | Confirmed (BR-007) |
| captchaToken | string | yes | verified server-side with the CAPTCHA vendor (INT-006) | Assumed (vendor open, OQ-AUTH-02) |
| timeZone | string | no | IANA zone detected from the browser; defaults to UTC | Assumed |


## Response
- `201 Created` -> `{ user: Me }` (shape of EP-AUTH-07) and Set-Cookie `tn_session` + `tn_csrf`; user is signed in, `emailVerified:false`
- `400 VALIDATION_ERROR` field errors (weak/common password, terms not accepted, bad email, disposable domain `DISPOSABLE_EMAIL`)
- `400 CAPTCHA_FAILED`
- `409 EMAIL_REGISTERED` clear message to sign in or reset password (BR-026, DEC-039); no second account is created

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
- `CAPTCHA_SECRET` - required; server-side verification key (vendor TBD)
- `DISPOSABLE_DOMAINS_SOURCE` - optional; path/URL of blocklist (default bundled list)
- `APP_BASE_URL` - required; builds the verification link

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- CAPTCHA verification service (INT-006)
- Email delivery via EP-NOTF-01 (INT-001)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Validate input and CAPTCHA, reject disposable domains from the blocklist, reject common passwords (BR-001, BR-026).
- Hash password (DEC-079), insert user with status `active`, `emailVerified:false`, store terms acceptance + timestamp.
- Create the default list 'My Tasks' (`isDefault:true`) for the user (BR-008, LIST-UC-01).
- Create session (non-remembered: ends on browser close, hard cap 1 day, BR-003) and set cookies.
- Create a `verify` email token (24h, BR-002) and hand the verification email to EP-NOTF-01.
- Account creation is the sign-up event the client reports to analytics after consent (ANLY, no server call).

## Called by
- PAGE-AUTH-01 Sign Up - ../../../../../../../frontend/context/code-context/frontend/pages/auth/sign-up.md (frontend repo)

## Reads / Writes Entities
- Writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes lists - ../../../../database/collections/lists.md (ENT-LIST-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)
- Writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)

## Integrations
- INT-001 (see shared-context/integrations.md)
- INT-006 (see shared-context/integrations.md)

## Used by Features
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-LIST-01 List Management

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- OQ-AUTH-02 | Which CAPTCHA vendor (accessible, WCAG 2.1 AA)? | TL (TL-006) | Blocks CAPTCHA verification adapter | Open
- OQ-AUTH-03 | Source and upkeep of the disposable-email domain blocklist | TL / Product | Affects BR-026 accuracy | Open

## Source References
- Features: FEAT-AUTH-01, FEAT-LIST-01
- Workflows: WF-001
- Business rules: BR-001, BR-002, BR-007, BR-008, BR-026
- Data: DATA-001, DATA-002, DATA-003, DATA-004
- Integrations: INT-001, INT-006
- Decisions: DEC-077, DEC-079, DEC-080
