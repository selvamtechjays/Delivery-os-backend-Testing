---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-PROF-07
method: POST
path: "/api/v1/me/deletion"
match_key: "POST /api/v1/me/deletion"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: profile
source_reference: "src/profile/profile.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Request Account Deletion

## Endpoint ID
EP-PROF-07

## Summary
Confirm deletion: end all sessions, disable access immediately, mark the account for permanent deletion in 30 days, and email a confirmation.

## Status
Proposed

## Method + Path
POST /api/v1/me/deletion

## Domain
profile

## Purpose
Confirm deletion: end all sessions, disable access immediately, mark the account for permanent deletion in 30 days, and email a confirmation.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| password | string | yes | re-entry | Assumed (feature marks it assumed) |


## Response
- `202 Accepted` -> `{ purgeAt }`
- `403 CURRENT_PASSWORD_INVALID`

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
- Email delivery via EP-NOTF-01

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Set `deletionRequestedAt = now`, `status = 'pending-deletion'`, `purgeAt = now + 30 days` (BR-024).
- Revoke all sessions, email a confirmation via EP-NOTF-01 (assumed), exclude user from digest (BR-015).
- Permanent removal is done by EP-PROF-09.

## Called by
- PAGE-PROF-02 Account Data And Deletion - ../../../../../../../frontend/context/code-context/frontend/pages/profile/account-data-and-deletion.md (frontend repo)

## Reads / Writes Entities
- Reads and writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)

## Integrations
- INT-001 (see shared-context/integrations.md)

## Used by Features
- FEAT-PROF-02 Account Deletion and Data Export

## Source Reference
- Planned file: `src/profile/profile.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/profile/`)

## Open Questions
- OQ-PROF-02 | Identity confirmation for Google-only accounts | BA / TL | | Open

## Source References
- Features: FEAT-PROF-02
- Workflows: WF-005
- Business rules: BR-024
- Data: DATA-001
- Integrations: INT-001
- Decisions: DEC-086
