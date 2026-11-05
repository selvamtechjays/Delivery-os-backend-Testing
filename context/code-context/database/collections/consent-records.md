---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-ANLY-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/analytics/consent-record.model.ts"
generated_at: 2026-11-05
---

# Entity: consent_records

## Entity ID
ENT-ANLY-01

## Summary
Cookie-consent decisions (choice and timestamp) per signed-in user or anonymous visitor id. Realises DATA-008.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
DATA-008 (shared-context/data.md) - the business entity this realises.

## Purpose
Cookie-consent decisions (choice and timestamp) per signed-in user or anonymous visitor id. Realises DATA-008.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| subjectKey | string | required | `user:<id>` or `visitor:<uuid>` | Assumed |
| choice | enum accepted\|declined | required |  | Confirmed (DATA-008) |
| decidedAt | date | required |  | Confirmed (DATA-008) |
| userAgent | string | nullable | evidence of consent | Assumed |

## Keys & Indexes
- PK: `_id`
- Index: `{ subjectKey:1, decidedAt:-1 }`

## Relationships
- Optional N-1 users (via subjectKey)

## Used by Endpoints
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md
- EP-ANLY-01 GET /api/v1/consent (R) - ../../backend/domains/analytics/endpoints/get-consent.md
- EP-ANLY-02 PUT /api/v1/consent (W) - ../../backend/domains/analytics/endpoints/set-consent.md

## Used by Features
- FEAT-ANLY-01 Analytics and Cookie Consent
- FEAT-PROF-02 Account Deletion and Data Export

## Data Classification / Retention
Compliance record. Retention for anonymous rows open (OQ-ANLY-02); user rows are deleted with the account (EP-PROF-09).

## Source Reference
- Planned file: `src/analytics/consent-record.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `consent_records`

## Open Questions
- None

## Source References
- Features: FEAT-ANLY-01, FEAT-PROF-02
- Data register: DATA-008
- Workflows: WF-010
- Business rules: BR-019
- Integrations: None
