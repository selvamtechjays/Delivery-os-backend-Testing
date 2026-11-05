---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-03
method: POST
path: "/api/v1/auth/resend-verification"
match_key: "POST /api/v1/auth/resend-verification"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Resend Verification Email

## Endpoint ID
EP-AUTH-03

## Summary
Issue a fresh verification link for the signed-in unverified user; rate-limited.

## Status
Proposed

## Method + Path
POST /api/v1/auth/resend-verification

## Domain
auth

## Purpose
Issue a fresh verification link for the signed-in unverified user; rate-limited.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
None (no request body or parameters).

## Response
- `202 Accepted` -> `{ sent: true }`
- `409 ALREADY_VERIFIED`
- `429 RATE_LIMITED` with `Retry-After` (BR-027)

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
- `VERIFY_RESEND_LIMIT_PER_HOUR` - optional; default 3 (Assumed)

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- Email delivery via EP-NOTF-01

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Invalidate earlier unused `verify` tokens for the user, create a new 24h token, hand email to EP-NOTF-01.
- Rate limit per user: at most 3 requests per hour (Assumed; BR-027 says rate-limited without a number, OQ-AUTH-07).

## Called by
- PAGE-AUTH-03 Verify Email - ../../../../../../../frontend/context/code-context/frontend/pages/auth/verify-email.md (frontend repo)
- PAGE-TASK-01 Task List - ../../../../../../../frontend/context/code-context/frontend/pages/task/task-list.md (frontend repo)
- PAGE-UXP-01 App Shell (Authenticated Layout) - ../../../../../../../frontend/context/code-context/frontend/pages/uxp/app-shell.md (frontend repo)

## Reads / Writes Entities
- Reads users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)

## Integrations
- INT-001 (see shared-context/integrations.md)

## Used by Features
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- OQ-AUTH-07 | Exact resend rate limit (requests per period) | BA / Product | Anti-abuse tuning | Open

## Source References
- Features: FEAT-AUTH-01, FEAT-TASK-01
- Workflows: WF-001
- Business rules: BR-002, BR-027
- Data: DATA-003
- Integrations: INT-001
- Decisions: DEC-080
