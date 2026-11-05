---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-UXP-01
method: GET
path: "/health"
match_key: "GET /health"
status: Proposed
implementation_state: Implemented
origin: as-built (scaffold)
repo: backend
domain: platform
source_reference: "src/routes/health.ts"
generated_at: 2026-11-05
---

# Endpoint: Health Check

## Endpoint ID
EP-UXP-01

## Summary
Liveness/readiness probe: reports process status and MongoDB connectivity; used for the 99.5% availability monitoring.

## Status
Proposed

## Method + Path
GET /health

## Domain
platform

## Purpose
Liveness/readiness probe: reports process status and MongoDB connectivity; used for the 99.5% availability monitoring.

## Trigger
Trigger: Service (uptime monitor / load balancer probe).

## Request
None (no request body or parameters).

## Response
- `200 OK` -> `{ status: 'ok', db: 'connected'|'disconnected' }`

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
- None required to answer; reports MongoDB state only

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Exists in the scaffold (`src/routes/health.ts`, DEC-011/014, contract in `src/contract/health.ts`); does not require the database to answer. Mounted at the root, outside `/api/v1`.

## Called by
- Trigger: Service (uptime monitor / load balancer probe).

## Reads / Writes Entities
- None

## Integrations
- None

## Used by Features
- FEAT-UXP-03 Hosting, Availability and Data Residency

## Source Reference
- Planned file: `src/routes/health.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- As built in the scaffold: `src/routes/health.ts`, contract `src/contract/health.ts`

## Open Questions
- OQ-UXP-01 | Hosting products on GCP (compute, MongoDB hosting in an EU region, scheduler, storage) are a TL decision still open | TL | Runtime topology and cost (BR-041) | Open

## Source References
- Features: FEAT-UXP-03
- Workflows: None
- Business rules: BR-042
- Data: None
- Integrations: None
- Decisions: DEC-092
