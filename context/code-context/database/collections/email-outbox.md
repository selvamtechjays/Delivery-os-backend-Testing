---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-NOTF-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/notifications/email-outbox.model.ts"
generated_at: 2026-11-05
---

# Entity: email_outbox

## Entity ID
ENT-NOTF-01

## Summary
Outbox of transactional and digest emails with delivery status, enabling retries independent of the provider (INT-001).

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
None. No DATA-### counterpart: technical outbox for INT-001 (delivery policy pending OQ-NOTF-02).

## Purpose
Outbox of transactional and digest emails with delivery status, enabling retries independent of the provider (INT-001).

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| template | enum verify\|reset\|password-changed\|email-change\|account-disabled\|account-deletion\|digest | required | BR-040 | Confirmed |
| toEmail | string | required |  | Confirmed |
| userId | ObjectId | nullable |  | Assumed |
| variables | object | required | template variables; link tokens are never stored here, only the already-built URL is passed through memory | Assumed |
| status | enum queued\|sent\|failed | default queued |  | Assumed |
| attempts | int | default 0 |  | Assumed |
| nextAttemptAt | date | nullable |  | Assumed |
| providerMessageId | string | nullable |  | Assumed |
| createdAt, sentAt | date |  | TTL cleanup after 30 days (Assumed) | Assumed |

## Keys & Indexes
- PK: `_id`
- Index: `{ status:1, nextAttemptAt:1 }`
- TTL index on `createdAt` (30 days)

## Relationships
- N-1 users (optional)

## Used by Endpoints
- EP-NOTF-01 (Service) send-templated-email (W) - ../../backend/domains/notifications/endpoints/send-templated-email.md
- EP-NOTF-03 (Schedule) email-outbox-retry (RW) - ../../backend/domains/notifications/endpoints/email-outbox-retry.md

## Used by Features
- FEAT-ADMN-02 Admin User Management
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-03 Password Recovery
- FEAT-NOTF-01 Daily Digest Email
- FEAT-NOTF-02 Transactional Email Delivery and Branded Templates
- FEAT-PROF-01 Profile Management

## Data Classification / Retention
Contains recipient emails (PII) and rendered variables; short retention. Raw tokens must not be persisted: the link is rendered at send time (OQ-NOTF-02).

## Source Reference
- Planned file: `src/notifications/email-outbox.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `email_outbox`

## Open Questions
- OQ-NOTF-02 | Delivery-failure policy | BA / TL | Retry/status fields | Open

## Source References
- Features: FEAT-ADMN-02, FEAT-AUTH-01, FEAT-AUTH-03, FEAT-NOTF-01, FEAT-NOTF-02, FEAT-PROF-01
- Data register: None
- Workflows: WF-001, WF-003, WF-008
- Business rules: BR-040
- Integrations: INT-001
