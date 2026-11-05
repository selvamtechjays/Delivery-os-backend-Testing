---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-PROF-09
method: SCHEDULE
path: "(Schedule) account-purge-sweep"
match_key: "SCHEDULE account-purge-sweep"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: profile
source_reference: "src/profile/account-purge.job.ts"
generated_at: 2026-11-05
---

# Endpoint: Account Purge Sweep (Daily)

## Endpoint ID
EP-PROF-09

## Summary
Permanently delete all data of accounts whose 30-day recovery window has elapsed and record a tombstone so a backup restore cannot resurrect them.

## Status
Proposed

## Method + Path
(Schedule) account-purge-sweep

## Domain
profile

## Purpose
Permanently delete all data of accounts whose 30-day recovery window has elapsed and record a tombstone so a backup restore cannot resurrect them.

## Trigger
Trigger: Schedule (daily). Mechanism undecided (INT-005, OQ-NOTF-03).

## Request
None (no request body or parameters).

## Response
- Exit status and counters logged: `{ purged, failed }` (no HTTP response)

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
- `PURGE_GRACE_DAYS` - optional; default 30

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Find users with `status='pending-deletion'` and `purgeAt <= now`.
- Delete tasks, lists, sessions, email tokens, linked identities, consent records and the user document (BR-024).
- Write a `deletion_tombstones` row (hashed user id and hashed email, `deletedAt`) so the restore runbook can re-apply deletions (BR-042); the same email may register again afterwards.
- Delete or anonymise identifying analytics data via the pseudonymous `analyticsId` (OQ-ANLY-01).
- Idempotent per user; safe to re-run.

## Called by
- Trigger: Schedule (daily). Mechanism undecided (INT-005, OQ-NOTF-03).

## Reads / Writes Entities
- Reads and writes users - ../../../../database/collections/users.md (ENT-AUTH-01)
- Writes sessions - ../../../../database/collections/sessions.md (ENT-AUTH-02)
- Writes email_tokens - ../../../../database/collections/email-tokens.md (ENT-AUTH-03)
- Writes linked_identities - ../../../../database/collections/linked-identities.md (ENT-AUTH-04)
- Writes lists - ../../../../database/collections/lists.md (ENT-LIST-01)
- Writes tasks - ../../../../database/collections/tasks.md (ENT-TASK-01)
- Writes consent_records - ../../../../database/collections/consent-records.md (ENT-ANLY-01)
- Writes deletion_tombstones - ../../../../database/collections/deletion-tombstones.md (ENT-PROF-01)

## Integrations
- INT-005 (see shared-context/integrations.md)

## Used by Features
- FEAT-ANLY-01 Analytics and Cookie Consent
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-UXP-03 Hosting, Availability and Data Residency

## Source Reference
- Planned file: `src/profile/account-purge.job.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/profile/`)

## Open Questions
- OQ-ANLY-01 | How is identifying analytics data deleted/anonymised in GA4 on account deletion (CLR-033)? | Legal / TL | Purge step 4 | Open

## Source References
- Features: FEAT-ANLY-01, FEAT-PROF-02, FEAT-UXP-03
- Workflows: WF-005
- Business rules: BR-024, BR-042
- Data: DATA-001, DATA-004, DATA-005, DATA-008
- Integrations: INT-005
- Decisions: DEC-086
