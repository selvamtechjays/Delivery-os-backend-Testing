---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-10
method: POST
path: "/api/v1/auth/google"
match_key: "POST /api/v1/auth/google"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Sign In Or Up With Google

## Endpoint ID
EP-AUTH-10

## Summary
Accept a Google ID token from the client, verify it, then create, sign in or start account linking.

## Status
Proposed

## Method + Path
POST /api/v1/auth/google

## Domain
auth

## Purpose
Accept a Google ID token from the client, verify it, then create, sign in or start account linking.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| idToken | string | yes | Google Identity Services credential; verified by the OAuthVerifier port (src/ports/oauth-verifier.ts) | Assumed (OQ-AUTH-08) |
| acceptedTerms | boolean | new accounts | required when no account exists yet | Assumed |
| timeZone | string | no |  | Assumed |


## Response
- `200 OK` -> `{ status:'signed-in', user: Me }` + cookies (existing Google account, or new account created)
- `202 Accepted` -> `{ status:'link-verification-sent' }` when the same email exists as an email/password account; a confirmation email is sent (BR-029)
- `400 GOOGLE_TOKEN_INVALID`
- `403 ACCOUNT_DISABLED`

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
- `GOOGLE_CLIENT_ID` - required; audience for ID-token verification

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- Google identity (INT-002) via OAuthVerifier port

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Verify the token (audience = our client id, `email_verified` true) via the OAuthVerifier port.
- No user with that email: create user (verified, no password), linked identity, default list, session.
- User exists and already has this Google identity: sign in.
- User exists created by email: do not link yet; create a `google-link` token and email it (EP-NOTF-01); link completes in EP-AUTH-11 (BR-029, DEC-045).
- Cancelling at the Google screen is client-side only; nothing is sent.

## Called by
- PAGE-AUTH-01 Sign Up - ../../../../../../../frontend/context/code-context/frontend/pages/auth/sign-up.md (frontend repo)
- PAGE-AUTH-02 Sign In - ../../../../../../../frontend/context/code-context/frontend/pages/auth/sign-in.md (frontend repo)

## Reads / Writes Entities
- Reads and writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Reads and writes linked_identities - ../../../../database/collections/linked-identities.md (ENT-AUTH-04)
- Writes lists - ../../../../database/collections/lists.md (ENT-LIST-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)
- Writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)

## Integrations
- INT-002 (see shared-context/integrations.md)
- INT-001 (see shared-context/integrations.md)

## Used by Features
- FEAT-AUTH-04 Google Sign-in (Optional)

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- OQ-AUTH-08 | Google flow: client-side ID-token (assumed) vs server redirect; INT-002 contract is undecided | TL | Changes this endpoint and the Sign Up/Sign In pages | Open

## Source References
- Features: FEAT-AUTH-04
- Workflows: WF-004
- Business rules: BR-029
- Data: DATA-001, DATA-004
- Integrations: INT-002, INT-001
- Decisions: DEC-089
