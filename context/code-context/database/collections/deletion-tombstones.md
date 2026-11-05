---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-PROF-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/profile/deletion-tombstone.model.ts"
generated_at: 2026-11-05
---

# Entity: deletion_tombstones

## Entity ID
ENT-PROF-01

## Summary
Minimal record of permanently deleted accounts so a backup restore can re-apply deletions and deleted data never reappears (BR-042).

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
None. No DATA-### counterpart: a technical object required by BR-042 (deleted data must not reappear on restore).

## Purpose
Minimal record of permanently deleted accounts so a backup restore can re-apply deletions and deleted data never reappears (BR-042).

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| userIdHash | string | required, unique | HMAC of the former user id | Assumed |
| emailHash | string | required | HMAC of the lower-cased email (no readable PII kept) | Assumed |
| deletedAt | date | required |  | Confirmed (BR-042) |

## Keys & Indexes
- PK: `_id`
- Unique: `userIdHash`
- Index: `deletedAt`

## Relationships
- No references (outlives its user)

## Used by Endpoints
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md

## Used by Features
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-UXP-03 Hosting, Availability and Data Residency

## Data Classification / Retention
Contains no readable personal data (hashes only). Retention: at least as long as the oldest retained backup (30 days, BR-042) plus margin; exact period open (OQ-PROF-05).

## Source Reference
- Planned file: `src/profile/deletion-tombstone.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `deletion_tombstones`

## Open Questions
- OQ-PROF-05 | Tombstone retention period and the restore runbook that replays them | TL / Ops | Backup/restore procedure (BR-042) | Open

## Source References
- Features: FEAT-PROF-02, FEAT-UXP-03
- Data register: None
- Workflows: WF-005
- Business rules: BR-024, BR-042
- Integrations: None
