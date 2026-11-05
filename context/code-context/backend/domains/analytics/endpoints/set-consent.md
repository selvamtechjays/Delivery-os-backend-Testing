---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-ANLY-02
method: PUT
path: "/api/v1/consent"
match_key: "PUT /api/v1/consent"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: analytics
source_reference: "src/analytics/consent.routes.ts"
generated_at: 2026-11-05
---

# Endpoint: Record Or Withdraw Cookie Consent

## Endpoint ID
EP-ANLY-02

## Summary
Store accept/decline/withdraw with a timestamp.

## Status
Proposed

## Method + Path
PUT /api/v1/consent

## Domain
analytics

## Purpose
Store accept/decline/withdraw with a timestamp.

## Trigger
Called by page(s) - see Called by. HTTP request from the frontend over REST.

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| choice | enum accepted\|declined | yes | withdrawal is a new `declined` row | Confirmed (ANLY-UC-01/02) |
| visitorId | string (uuid) | no | used when not signed in | Assumed |


## Response
- `200 OK` -> `{ choice, decidedAt }`
- `400 VALIDATION_ERROR`

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** Optional opaque session token (as other user endpoints) or none for anonymous visitors
- **Verified by:** `optionalSession` middleware: resolves the user when a valid session cookie is present, otherwise continues anonymously
- **Client obtains via:** `Set-Cookie` from sign-in/sign-up when signed in; anonymous visitors send a client-generated `visitorId`
- **Header format:** `Cookie: tn_session=<token>` (when signed in); `X-CSRF-Token` on PUT when a session exists
- **Server extracts:** `req.auth?.userId` or `visitorId` from query/body
- **Failure responses:**
  - 403 `CSRF_INVALID` (signed-in PUT without matching token); invalid cookies are treated as anonymous
- **Server prerequisites:** `cookie-parser`; CORS with credentials
- **Permissions layered on top of authentication:** None

Confidence: Assumed (DEC-077, DEC-087).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `MONGODB_URI` - required
- `CORS_ORIGINS` - required
- `COOKIE_DOMAIN` - required in deployed envs (new)

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Append-only history per subject; the latest row wins. The client starts GA4 only after `accepted` and disables it immediately on `declined` (ANLY-FR-03, DEC-062).
- When a signed-in user decides, `visitorId` rows are merged to the user.

## Called by
- PAGE-UXP-01 App Shell (Authenticated Layout) - ../../../../../../../frontend/context/code-context/frontend/pages/uxp/app-shell.md (frontend repo)

## Reads / Writes Entities
- Writes consent_records - ../../../../database/collections/consent-records.md (ENT-ANLY-01)

## Integrations
- INT-004 (see shared-context/integrations.md)

## Used by Features
- FEAT-ANLY-01 Analytics and Cookie Consent

## Source Reference
- Planned file: `src/analytics/consent.routes.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/analytics/`)

## Open Questions
- OQ-ANLY-01 | GA4 acceptability for EU users (CLR-033); if a privacy-focused tool replaces GA4 the client integration changes | Legal | Client analytics adapter | Open

## Source References
- Features: FEAT-ANLY-01
- Workflows: WF-010
- Business rules: BR-019
- Data: DATA-008
- Integrations: INT-004
- Decisions: DEC-087
