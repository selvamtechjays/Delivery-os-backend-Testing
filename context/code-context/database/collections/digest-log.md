---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-NOTF-02
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/notifications/digest-log.model.ts"
generated_at: 2026-11-05
---

# Entity: digest_log

## Entity ID
ENT-NOTF-02

## Summary
Guarantees at most one digest per user per local day (BR-015) and records skipped-empty days.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
None. No DATA-### counterpart: technical idempotency guard for BR-015.

## Purpose
Guarantees at most one digest per user per local day (BR-015) and records skipped-empty days.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| userId | ObjectId | required |  | Confirmed |
| localDate | string (YYYY-MM-DD) | required | date in the user's zone at send time | Confirmed (BR-015) |
| outcome | enum sent\|skipped-empty | required |  | Assumed |
| createdAt | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Unique: `{ userId:1, localDate:1 }` (idempotency)
- TTL index on `createdAt` (14 days)

## Relationships
- N-1 users (ENT-AUTH-01)

## Used by Endpoints
- EP-NOTF-02 (Schedule) daily-digest-sweep (RW) - ../../backend/domains/notifications/endpoints/daily-digest-sweep.md

## Used by Features
- FEAT-NOTF-01 Daily Digest Email

## Data Classification / Retention
Operational log, ids and dates only. Deleted with the account.

## Source Reference
- Planned file: `src/notifications/digest-log.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `digest_log`

## Open Questions
- None

## Source References
- Features: FEAT-NOTF-01
- Data register: None
- Workflows: WF-008
- Business rules: BR-015
- Integrations: INT-005
