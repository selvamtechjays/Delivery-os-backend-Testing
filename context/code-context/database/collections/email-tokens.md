---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-AUTH-03
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/auth/email-token.model.ts"
generated_at: 2026-11-05
---

# Entity: email_tokens

## Entity ID
ENT-AUTH-03

## Summary
Single-use, time-limited tokens for email verification, email change, password reset and Google link confirmation. Realises DATA-003.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
DATA-003 (shared-context/data.md) - the business entity this realises.

## Purpose
Single-use, time-limited tokens for email verification, email change, password reset and Google link confirmation. Realises DATA-003.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| userId | ObjectId | required |  | Confirmed (DATA-003) |
| purpose | enum verify\|reset\|email-change\|google-link | required | DATA-003 lists verify/reset/email-change; `google-link` added for BR-029 | Confirmed / Assumed (google-link) |
| tokenHash | string | required, unique | SHA-256 of the emailed token | Assumed (DEC-080) |
| pendingEmail | string | nullable | for email-change (new address) | Assumed |
| expiresAt | date | required | verify 24h (BR-002), reset 1h (BR-005), email-change 24h, google-link 1h | Confirmed / Assumed |
| usedAt | date | nullable | single use | Confirmed (DATA-003) |
| createdAt | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Unique: `tokenHash`
- Index: `{ userId:1, purpose:1 }`
- TTL index on `expiresAt` (plus grace) for cleanup

## Relationships
- N-1 users (ENT-AUTH-01)

## Used by Endpoints
- EP-AUTH-01 POST /api/v1/auth/signup (W) - ../../backend/domains/auth/endpoints/sign-up.md
- EP-AUTH-02 POST /api/v1/auth/verify-email (RW) - ../../backend/domains/auth/endpoints/verify-email.md
- EP-AUTH-03 POST /api/v1/auth/resend-verification (W) - ../../backend/domains/auth/endpoints/resend-verification.md
- EP-AUTH-08 POST /api/v1/auth/forgot-password (W) - ../../backend/domains/auth/endpoints/forgot-password.md
- EP-AUTH-09 POST /api/v1/auth/reset-password (RW) - ../../backend/domains/auth/endpoints/reset-password.md
- EP-AUTH-10 POST /api/v1/auth/google (W) - ../../backend/domains/auth/endpoints/google-sign-in.md
- EP-AUTH-11 POST /api/v1/auth/google/link-confirm (RW) - ../../backend/domains/auth/endpoints/google-link-confirm.md
- EP-PROF-04 POST /api/v1/me/email (W) - ../../backend/domains/profile/endpoints/request-email-change.md
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md

## Used by Features
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-03 Password Recovery
- FEAT-AUTH-04 Google Sign-in (Optional)
- FEAT-LIST-01 List Management
- FEAT-PROF-01 Profile Management
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)

## Data Classification / Retention
Security-sensitive. Only hashes stored. Deleted with the account.

## Source Reference
- Planned file: `src/auth/email-token.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `email_tokens`

## Open Questions
- None

## Source References
- Features: FEAT-AUTH-01, FEAT-AUTH-03, FEAT-AUTH-04, FEAT-LIST-01, FEAT-PROF-01, FEAT-PROF-02, FEAT-TASK-01
- Data register: DATA-003
- Workflows: WF-001, WF-003, WF-004
- Business rules: BR-002, BR-005, BR-006, BR-027, BR-029
- Integrations: None
