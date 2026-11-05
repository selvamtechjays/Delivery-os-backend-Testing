---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-AUTH-04
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/auth/linked-identity.model.ts"
generated_at: 2026-11-05
---

# Entity: linked_identities

## Entity ID
ENT-AUTH-04

## Summary
Links an external identity (Google) to a user so Google and email/password sign-in resolve to one account (BR-029).

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
None. No DATA-### counterpart: the BA register has no entry for linked identities; Google identity data is INT-002. Raised as OQ-ADMN-01 for the BA to extend DATA.

## Purpose
Links an external identity (Google) to a user so Google and email/password sign-in resolve to one account (BR-029).

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| userId | ObjectId | required |  | Confirmed (BR-029) |
| provider | enum google | required | only Google in v1 | Confirmed |
| providerSubject | string | required | Google `sub` | Assumed |
| emailAtLink | string | required |  | Assumed |
| linkedAt | date | required |  | Assumed |

## Keys & Indexes
- PK: `_id`
- Unique: `{ provider:1, providerSubject:1 }`
- Index: `userId`

## Relationships
- N-1 users (ENT-AUTH-01)

## Used by Endpoints
- EP-AUTH-10 POST /api/v1/auth/google (RW) - ../../backend/domains/auth/endpoints/google-sign-in.md
- EP-AUTH-11 POST /api/v1/auth/google/link-confirm (W) - ../../backend/domains/auth/endpoints/google-link-confirm.md
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md

## Used by Features
- FEAT-AUTH-04 Google Sign-in (Optional)
- FEAT-PROF-02 Account Deletion and Data Export

## Data Classification / Retention
PII-adjacent (provider subject id). Deleted with the account.

## Source Reference
- Planned file: `src/auth/linked-identity.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `linked_identities`

## Open Questions
- OQ-ADMN-01 | The data register has no entries for linked identities, admin accounts, audit log, email outbox, digest log, deletion tombstones | BA | Add data-register rows or confirm these as purely technical objects | Open

## Source References
- Features: FEAT-AUTH-04, FEAT-PROF-02
- Data register: None
- Workflows: WF-004
- Business rules: BR-029
- Integrations: INT-002
