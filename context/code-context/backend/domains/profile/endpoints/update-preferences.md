---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-PROF-05
method: PATCH
path: "/api/v1/me/preferences"
match_key: "PATCH /api/v1/me/preferences"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: profile
source_reference: "src/profile/profile.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Update Preferences

## Endpoint ID
EP-PROF-05

## Summary
Update theme, digest on/off and the time zone used for the daily digest.

## Status
Proposed

## Method + Path
PATCH /api/v1/me/preferences

## Domain
profile

## Purpose
Update theme, digest on/off and the time zone used for the daily digest.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| theme | enum system\|light\|dark | no | manual override remembered across devices (BR-020) | Assumed |
| digestEnabled | boolean | no | honoured from the next scheduled run (NOTF-UC-02) | Confirmed |
| timeZone | string | no | valid IANA zone; later digests follow it (BR-015) | Confirmed |


## Response
- `200 OK` -> `Me`
- `400 VALIDATION_ERROR` (unknown time zone / theme)

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
- Partial update of the `preferences` subdocument (DATA-007). Digest eligibility itself is evaluated in EP-NOTF-02.

## Called by
- PAGE-PROF-01 Profile Settings - ../../../../../../../frontend/context/code-context/frontend/pages/profile/profile-settings.md (frontend repo)
- PAGE-UXP-01 App Shell (Authenticated Layout) - ../../../../../../../frontend/context/code-context/frontend/pages/uxp/app-shell.md (frontend repo)

## Reads / Writes Entities
- Writes users - ../../../../database/collections/users.md (ENT-AUTH-01)

## Integrations
- None

## Used by Features
- FEAT-NOTF-01 Daily Digest Email
- FEAT-PROF-01 Profile Management
- FEAT-UXP-01 App Shell, Theme and Instant Feedback

## Source Reference
- Planned file: `src/profile/profile.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/profile/`)

## Open Questions
- None

## Source References
- Features: FEAT-NOTF-01, FEAT-PROF-01, FEAT-UXP-01
- Workflows: WF-005, WF-008
- Business rules: BR-015, BR-020
- Data: DATA-007
- Integrations: None
- Decisions: DEC-081
