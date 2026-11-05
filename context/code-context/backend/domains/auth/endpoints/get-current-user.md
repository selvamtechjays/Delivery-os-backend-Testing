---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-07
method: GET
path: "/api/v1/auth/me"
match_key: "GET /api/v1/auth/me"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Get Current User (Session Bootstrap)

## Endpoint ID
EP-AUTH-07

## Summary
Return the signed-in user's profile, verification state, preferences and usage limits; also refreshes the CSRF cookie. The app shell polls it so a verification done on another device clears the banner.

## Status
Proposed

## Method + Path
GET /api/v1/auth/me

## Domain
auth

## Purpose
Return the signed-in user's profile, verification state, preferences and usage limits; also refreshes the CSRF cookie. The app shell polls it so a verification done on another device clears the banner.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
None (no request body or parameters).

## Response
- `200 OK` -> `Me { id, name, email, emailVerified, status, photoUrl|null, authMethods:['password'|'google'], preferences:{ theme:'system'|'light'|'dark', digestEnabled, timeZone }, limits:{ maxTasks:5|null, canCreateLists } }`
- `401 SESSION_INVALID`

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
- Resolve user from session; `limits.maxTasks = 5` and `canCreateLists = false` while unverified, else `null`/`true` (BR-002, BR-027, BR-016).
- `photoUrl` is a short-lived signed URL (BR-031).
- Never returns password hash, tokens or lockout fields.

## Called by
- PAGE-PROF-01 Profile Settings - ../../../../../../../frontend/context/code-context/frontend/pages/profile/profile-settings.md (frontend repo)
- PAGE-UXP-01 App Shell (Authenticated Layout) - ../../../../../../../frontend/context/code-context/frontend/pages/uxp/app-shell.md (frontend repo)
- PAGE-UXP-02 Public Landing Page - ../../../../../../../frontend/context/code-context/frontend/pages/uxp/landing.md (frontend repo)

## Reads / Writes Entities
- Reads sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)
- Reads users - ../../../../database/collections/users.md (ENT-AUTH-01)

## Integrations
- None

## Used by Features
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-02 Sign-in and Session Management
- FEAT-PROF-01 Profile Management
- FEAT-UXP-01 App Shell, Theme and Instant Feedback
- FEAT-UXP-02 Public Landing Page

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- OQ-AUTH-10 | Cross-device verified-banner update by polling /auth/me (no push channel) is acceptable? | BA / UX | Poll interval vs cost | Open

## Source References
- Features: FEAT-AUTH-01, FEAT-AUTH-02, FEAT-PROF-01, FEAT-UXP-01, FEAT-UXP-02
- Workflows: WF-001
- Business rules: BR-002, BR-016, BR-027, BR-031
- Data: DATA-001, DATA-007
- Integrations: None
- Decisions: DEC-077, DEC-088
