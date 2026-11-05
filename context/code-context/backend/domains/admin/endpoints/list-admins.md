---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-ADMN-04
method: GET
path: "/api/v1/admin/admins"
match_key: "GET /api/v1/admin/admins"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: admin
source_reference: "src/admin/admin.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: List Admin Accounts

## Endpoint ID
EP-ADMN-04

## Summary
List admin accounts and roles.

## Status
Proposed

## Method + Path
GET /api/v1/admin/admins

## Domain
admin

## Purpose
List admin accounts and roles.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
None (no request body or parameters).

## Response
- `200 OK` -> `{ admins: [{ id, name, email, role, createdAt }] }`
- `403 FORBIDDEN_ROLE`

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** Opaque 256-bit random admin session token (not a JWT); SHA-256 hash stored in `sessions` with `subjectType: admin` (ENT-AUTH-02)
- **Verified by:** `requireAdminSession` middleware (planned `src/admin/admin-session.middleware.ts`): hash lookup, not revoked/expired, admin account still exists
- **Client obtains via:** `Set-Cookie` from `POST /api/v1/admin/auth/signin` (EP-ADMN-01); frontend calls through `src/lib/api.ts` with `credentials: 'include'`
- **Header format:** `Cookie: tn_admin_session=<token>` (httpOnly, Secure, SameSite=Lax, `Path=/api/v1/admin` so user routes never receive it); non-GET also `X-CSRF-Token: <tn_csrf cookie value>`
- **Server extracts:** `req.admin = { adminId, role, sessionId }`
- **Failure responses:**
  - 401 `SESSION_INVALID`; 403 `CSRF_INVALID`; 403 `FORBIDDEN_ROLE` (insufficient role)
- **Server prerequisites:** `cookie-parser`; CORS with credentials and exact origin; reachable MongoDB
- **Permissions layered on top of authentication:** `super-admin` role only; `admin` gets 403 `FORBIDDEN_ROLE`.

Confidence: Assumed (design, DEC-078).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `MONGODB_URI` - required
- `CORS_ORIGINS` - required
- `COOKIE_DOMAIN` - required in deployed envs (new)
- `COOKIE_SECURE` - optional; default true outside local dev

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Super Admin only (BR-037).

## Called by
- PAGE-ADMN-03 Admin Accounts - ../../../../../../../frontend/context/code-context/frontend/pages/admin/admin-accounts.md (frontend repo)

## Reads / Writes Entities
- Reads admin_accounts - ../../../../database/collections/admin-accounts.md (ENT-ADMN-01)

## Integrations
- None

## Used by Features
- FEAT-ADMN-01 Admin Access and Roles

## Source Reference
- Planned file: `src/admin/admin.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/admin/`)

## Open Questions
- None

## Source References
- Features: FEAT-ADMN-01
- Workflows: WF-009
- Business rules: BR-037
- Data: None
- Integrations: None
- Decisions: None
