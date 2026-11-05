---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-PROF-08
method: POST
path: "/api/v1/auth/recover-account"
match_key: "POST /api/v1/auth/recover-account"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: profile
source_reference: "src/profile/profile.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Recover Account During Deletion Window

## Endpoint ID
EP-PROF-08

## Summary
Cancel a pending deletion within 30 days by signing in and confirming identity; all data is restored.

## Status
Proposed

## Method + Path
POST /api/v1/auth/recover-account

## Domain
profile

## Purpose
Cancel a pending deletion within 30 days by signing in and confirming identity; all data is restored.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| email | string | yes |  | Confirmed (DEC-060) |
| password | string | yes | identity confirmation by credentials | Assumed (OQ-PROF-02) |


## Response
- `200 OK` -> `{ user: Me }` + session cookies; account active again
- `401 INVALID_CREDENTIALS`
- `410 PURGED` account already permanently deleted

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

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Verify credentials for a `pending-deletion` user, clear deletion fields, set `status='active'`, start a session. Because purge has not run, lists, tasks and preferences are intact (BR-024, DEC-060).

## Called by
- PAGE-AUTH-02 Sign In - ../../../../../../../frontend/context/code-context/frontend/pages/auth/sign-in.md (frontend repo)

## Reads / Writes Entities
- Reads and writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)

## Integrations
- None

## Used by Features
- FEAT-PROF-02 Account Deletion and Data Export

## Source Reference
- Planned file: `src/profile/profile.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/profile/`)

## Open Questions
- None

## Source References
- Features: FEAT-PROF-02
- Workflows: WF-005
- Business rules: BR-024
- Data: DATA-001
- Integrations: None
- Decisions: DEC-086
