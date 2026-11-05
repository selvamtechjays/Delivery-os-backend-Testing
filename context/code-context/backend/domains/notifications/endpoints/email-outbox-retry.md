---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-NOTF-03
method: SCHEDULE
path: "(Schedule) email-outbox-retry"
match_key: "SCHEDULE email-outbox-retry"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: notifications
source_reference: "src/notifications/outbox-retry.job.ts"
generated_at: 2026-11-05
---

# Endpoint: Email Outbox Retry Sweep

## Endpoint ID
EP-NOTF-03

## Summary
Retry queued transactional emails that failed their first attempt.

## Status
Proposed

## Method + Path
(Schedule) email-outbox-retry

## Domain
notifications

## Purpose
Retry queued transactional emails that failed their first attempt.

## Trigger
Trigger: Schedule (every minute, Assumed). Mechanism undecided (OQ-NOTF-03).

## Request
None (no request body or parameters).

## Response
- Counters logged: `{ retried, sent, gaveUp }`

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** None; internal job, not exposed over HTTP to browsers
- **Verified by:** n/a; if the scheduler is a managed service that invokes an internal HTTP hook, that hook must verify a platform-issued OIDC token or shared secret (undecided, OQ-NOTF-03)
- **Client obtains via:** n/a
- **Header format:** n/a (scheduler mechanism undecided)
- **Server extracts:** n/a
- **Failure responses:**
  - Job errors are logged with counters and never crash the API process
- **Server prerequisites:** a scheduler binding (INT-005) and a reachable MongoDB
- **Permissions layered on top of authentication:** None

Confidence: Needs Clarification (OQ-NOTF-03).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `MONGODB_URI` - required

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Pick `queued` rows with `nextAttemptAt <= now`, resend through the Mailer port, back off, mark `failed` after the maximum attempts (numbers pending OQ-NOTF-02).

## Called by
- Trigger: Schedule (every minute, Assumed). Mechanism undecided (OQ-NOTF-03).

## Reads / Writes Entities
- Reads and writes email_outbox - ../../../../database/collections/email-outbox.md (ENT-NOTF-01)

## Integrations
- INT-001 (see shared-context/integrations.md)
- INT-005 (see shared-context/integrations.md)

## Used by Features
- FEAT-NOTF-02 Transactional Email Delivery and Branded Templates

## Source Reference
- Planned file: `src/notifications/outbox-retry.job.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/notifications/`)

## Open Questions
- OQ-NOTF-02 | Delivery-failure policy | BA / TL | Retry ceiling and user-visible behaviour | Open

## Source References
- Features: FEAT-NOTF-02
- Workflows: WF-001, WF-003
- Business rules: BR-040
- Data: None
- Integrations: INT-001, INT-005
- Decisions: DEC-084
