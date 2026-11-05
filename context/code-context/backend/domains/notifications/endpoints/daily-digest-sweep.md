---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-NOTF-02
method: SCHEDULE
path: "(Schedule) daily-digest-sweep"
match_key: "SCHEDULE daily-digest-sweep"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: notifications
source_reference: "src/notifications/digest.job.ts"
generated_at: 2026-11-05
---

# Endpoint: Daily Digest Sweep (Hourly Tick)

## Endpoint ID
EP-NOTF-02

## Summary
Each tick finds eligible users whose local time just reached 08:00 and sends at most one digest each per day.

## Status
Proposed

## Method + Path
(Schedule) daily-digest-sweep

## Domain
notifications

## Purpose
Each tick finds eligible users whose local time just reached 08:00 and sends at most one digest each per day.

## Trigger
Trigger: Schedule (every hour, on the hour). Mechanism undecided (OQ-NOTF-03).

## Request
None (no request body or parameters).

## Response
- Counters logged: `{ considered, sent, skippedEmpty, skippedIneligible }`

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
- `DIGEST_LOCAL_HOUR` - optional; default 8

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- Scheduler (INT-005)
- Email delivery via EP-NOTF-01

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Select active, verified users with `digestEnabled`, not pending deletion, whose local hour in `preferences.timeZone` is 8 (BR-015, DEC-052).
- Insert `digest_log(userId, localDate)` first (unique index) so a re-run or overlapping tick cannot send twice (DEC-085).
- Collect tasks due today and overdue (BR-014); if none, send nothing and keep the log row; otherwise hand a digest to EP-NOTF-01.
- Time-zone changes apply from the next tick (NOTF-UC-02).

## Called by
- Trigger: Schedule (every hour, on the hour). Mechanism undecided (OQ-NOTF-03).

## Reads / Writes Entities
- Reads users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Reads tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)
- Reads and writes digest_log - ../../../../database/collections/digest-log.md (ENT-NOTF-02)

## Integrations
- INT-005 (see shared-context/integrations.md)
- INT-001 (see shared-context/integrations.md)

## Used by Features
- FEAT-NOTF-01 Daily Digest Email

## Source Reference
- Planned file: `src/notifications/digest.job.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/notifications/`)

## Open Questions
- OQ-NOTF-03 | Scheduler mechanism (INT-005): managed cloud scheduler calling an internal endpoint vs in-process cron; behaviour with multiple instances | TL / Infra | Runtime topology and cost | Open

## Source References
- Features: FEAT-NOTF-01
- Workflows: WF-008
- Business rules: BR-014, BR-015
- Data: DATA-001, DATA-005, DATA-007
- Integrations: INT-005, INT-001
- Decisions: DEC-085
