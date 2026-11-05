---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-AUTH-04
method: POST
path: "/api/v1/auth/signin"
match_key: "POST /api/v1/auth/signin"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: auth
source_reference: "src/auth/auth.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Sign In

## Endpoint ID
EP-AUTH-04

## Summary
Authenticate by email and password, enforce the 15-minute lockout, and start a session (remembered 30 days or short).

## Status
Proposed

## Method + Path
POST /api/v1/auth/signin

## Domain
auth

## Purpose
Authenticate by email and password, enforce the 15-minute lockout, and start a session (remembered 30 days or short).

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| email | string | yes | lower-cased | Confirmed |
| password | string | yes |  | Confirmed |
| rememberMe | boolean | no | default false; true => 30-day session (BR-003) | Confirmed (BR-003) |


## Response
- `200 OK` -> `{ user: Me }` + Set-Cookie `tn_session` (Max-Age 30d if remembered, otherwise session cookie with server expiry 1 day) + `tn_csrf`
- `401 INVALID_CREDENTIALS` (generic, counts a failed attempt)
- `423 ACCOUNT_LOCKED` -> `{ lockedUntil }` while locked, even for correct credentials (BR-004)
- `403 ACCOUNT_DISABLED` -> disabled message with contact-support note (BR-038)
- `403 ACCOUNT_PENDING_DELETION` -> `{ purgeAt }`; client offers recovery via EP-PROF-08 (BR-024)

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
- `SESSION_TTL_REMEMBER_DAYS` - optional; default 30
- `SESSION_TTL_DEFAULT_HOURS` - optional; default 24
- `LOCKOUT_THRESHOLD` - optional; default 5
- `LOCKOUT_MINUTES` - optional; default 15

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Look up user by email; verify password hash (constant-time).
- On failure increment `failedSignIns`; on the 5th consecutive failure set `lockedUntil = now + 15 min` (BR-004). Counter resets on success or after unlock.
- Locked accounts refuse sign-in before checking the password.
- Unverified users are allowed in; the banner is driven by `Me.emailVerified` (BR-002).
- Create session row and cookies; reply neutral on unknown email (same `INVALID_CREDENTIALS`).

## Called by
- PAGE-AUTH-02 Sign In - ../../../../../../../frontend/context/code-context/frontend/pages/auth/sign-in.md (frontend repo)

## Reads / Writes Entities
- Reads and writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)

## Integrations
- None

## Used by Features
- FEAT-ADMN-02 Admin User Management
- FEAT-AUTH-02 Sign-in and Session Management

## Source Reference
- Planned file: `src/auth/auth.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/auth/`)

## Open Questions
- OQ-AUTH-09 | Per-IP throttling on sign-in in addition to the per-account lockout (BR-004 is per account) | TL / Security | Credential-stuffing defence | Open

## Source References
- Features: FEAT-ADMN-02, FEAT-AUTH-02
- Workflows: WF-002
- Business rules: BR-003, BR-004, BR-038, BR-024
- Data: DATA-001, DATA-002
- Integrations: None
- Decisions: DEC-077, DEC-079
