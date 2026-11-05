---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-NOTF-01
method: EVENT
path: "(Service) send-templated-email"
match_key: "EVENT send-templated-email"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: notifications
source_reference: "src/notifications/email.service.ts"
generated_at: 2026-11-05
---

# Endpoint: Send Templated Email (Internal Service)

## Endpoint ID
EP-NOTF-01

## Summary
Single internal entry used by every flow to render a branded template and deliver it from the company domain through the Mailer port.

## Status
Proposed

## Method + Path
(Service) send-templated-email

## Domain
notifications

## Purpose
Single internal entry used by every flow to render a branded template and deliver it from the company domain through the Mailer port.

## Trigger
Trigger: Service (in-process call from EP-AUTH-01/03/08/09/10, EP-PROF-03/04/07, EP-ADMN-10, EP-NOTF-02).

## Request
| Field | Type | Required | Notes | Confidence |
|---|---|---|---|---|
| template | enum verify\|reset\|password-changed\|email-change\|account-disabled\|account-deletion\|digest | yes | branded templates (BR-040) | Confirmed |
| to | string | yes |  | Confirmed |
| data | object | yes | template variables (links, task list for digest) | Confirmed |


## Response
- Returns `{ outboxId, status:'sent'|'queued' }` to the calling flow; callers do not fail when email fails (see OQ-NOTF-02)

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** None; internal in-process service, not network-exposed
- **Verified by:** n/a (callable only from server code; no HTTP route)
- **Client obtains via:** n/a
- **Header format:** n/a
- **Server extracts:** n/a
- **Failure responses:**
  - Provider failures are caught and recorded on the outbox row; callers never fail because email failed (OQ-NOTF-02)
- **Server prerequisites:** Mailer port bound to a provider adapter at startup (`createApp` deps)
- **Permissions layered on top of authentication:** None

Confidence: Assumed (DEC-084).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `MONGODB_URI` - required
- `MAIL_FROM` - required; company-domain sender (e.g. noreply@domain)
- `MAIL_PROVIDER_API_KEY` - required; provider TBD (OQ-NOTF-01)
- `APP_BASE_URL` - required

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)
- Email provider (INT-001) via Mailer port

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Write an `email_outbox` row, render the template, attempt send through the Mailer port (src/ports/mailer.ts); on failure keep `queued` for EP-NOTF-03 retry.
- Sender is a company-owned domain with SPF, DKIM, DMARC (BR-040). Links in emails are built from `APP_BASE_URL`; tokens are never logged.

## Called by
- Trigger: Service (in-process call from EP-AUTH-01/03/08/09/10, EP-PROF-03/04/07, EP-ADMN-10, EP-NOTF-02).

## Reads / Writes Entities
- Writes email_outbox - ../../../../database/collections/email-outbox.md (ENT-NOTF-01)

## Integrations
- INT-001 (see shared-context/integrations.md)

## Used by Features
- FEAT-ADMN-02 Admin User Management
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-03 Password Recovery
- FEAT-NOTF-01 Daily Digest Email
- FEAT-NOTF-02 Transactional Email Delivery and Branded Templates
- FEAT-PROF-01 Profile Management

## Source Reference
- Planned file: `src/notifications/email.service.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/notifications/`)

## Open Questions
- OQ-NOTF-01 | Email provider (INT-001) and sender domain (CLR-018); SPF/DKIM/DMARC owner | Client / Infra / TL | Mailer adapter | Open
- OQ-NOTF-02 | Delivery-failure policy: retries, backoff, bounce/complaint handling, what the user sees | BA / TL | Outbox retry design | Open

## Source References
- Features: FEAT-ADMN-02, FEAT-AUTH-01, FEAT-AUTH-03, FEAT-NOTF-01, FEAT-NOTF-02, FEAT-PROF-01
- Workflows: WF-001, WF-003, WF-008
- Business rules: BR-040
- Data: None
- Integrations: INT-001
- Decisions: DEC-084
