---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-AUTH-02
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/auth/session.model.ts"
generated_at: 2026-11-05
---

# Entity: sessions

## Entity ID
ENT-AUTH-02

## Summary
Server-side sessions for users and admins; enables log-out-this-device, log-out-all and immediate revocation on disable/password change.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
DATA-002 (shared-context/data.md) - the business entity this realises.

## Purpose
Server-side sessions for users and admins; enables log-out-this-device, log-out-all and immediate revocation on disable/password change.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| tokenHash | string | required, unique | SHA-256 of the opaque cookie token; raw token never stored | Assumed (DEC-077) |
| subjectType | enum user\|admin | required | admin sessions use the admin cookie (DEC-078) | Assumed |
| subjectId | ObjectId | required | users._id or admin_accounts._id | Confirmed (DATA-002) |
| remember | boolean | required | true => 30 days (BR-003) | Confirmed (DATA-002) |
| createdAt | date | required |  | Confirmed (DATA-002) |
| expiresAt | date | required | now+30d if remembered, else now+1d (BR-003); admin now+8h | Confirmed (DATA-002) |
| revokedAt | date | nullable |  | Assumed |
| userAgent | string | nullable | display only | Assumed |

## Keys & Indexes
- PK: `_id`
- Unique: `tokenHash`
- Index: `{ subjectType:1, subjectId:1, revokedAt:1 }` (revoke-all)
- TTL index on `expiresAt` (expireAfterSeconds 0)

## Relationships
- N-1 users (ENT-AUTH-01) or admin_accounts (ENT-ADMN-01) via subjectType/subjectId

## Used by Endpoints
- EP-AUTH-01 POST /api/v1/auth/signup (W) - ../../backend/domains/auth/endpoints/sign-up.md
- EP-AUTH-04 POST /api/v1/auth/signin (W) - ../../backend/domains/auth/endpoints/sign-in.md
- EP-AUTH-05 POST /api/v1/auth/signout (W) - ../../backend/domains/auth/endpoints/sign-out.md
- EP-AUTH-06 POST /api/v1/auth/signout-all (W) - ../../backend/domains/auth/endpoints/sign-out-all.md
- EP-AUTH-07 GET /api/v1/auth/me (R) - ../../backend/domains/auth/endpoints/get-current-user.md
- EP-AUTH-09 POST /api/v1/auth/reset-password (W) - ../../backend/domains/auth/endpoints/reset-password.md
- EP-AUTH-10 POST /api/v1/auth/google (W) - ../../backend/domains/auth/endpoints/google-sign-in.md
- EP-AUTH-11 POST /api/v1/auth/google/link-confirm (W) - ../../backend/domains/auth/endpoints/google-link-confirm.md
- EP-PROF-03 POST /api/v1/me/password (W) - ../../backend/domains/profile/endpoints/change-password.md
- EP-PROF-07 POST /api/v1/me/deletion (W) - ../../backend/domains/profile/endpoints/request-account-deletion.md
- EP-PROF-08 POST /api/v1/auth/recover-account (W) - ../../backend/domains/profile/endpoints/recover-account.md
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md
- EP-ADMN-01 POST /api/v1/admin/auth/signin (W) - ../../backend/domains/admin/endpoints/admin-sign-in.md
- EP-ADMN-02 POST /api/v1/admin/auth/signout (W) - ../../backend/domains/admin/endpoints/admin-sign-out.md
- EP-ADMN-03 GET /api/v1/admin/auth/me (R) - ../../backend/domains/admin/endpoints/admin-get-current.md
- EP-ADMN-06 PATCH /api/v1/admin/admins/:adminId (W) - ../../backend/domains/admin/endpoints/change-admin-role.md
- EP-ADMN-07 DELETE /api/v1/admin/admins/:adminId (W) - ../../backend/domains/admin/endpoints/remove-admin.md
- EP-ADMN-10 POST /api/v1/admin/users/:userId/disable (W) - ../../backend/domains/admin/endpoints/disable-user.md

## Used by Features
- FEAT-ADMN-01 Admin Access and Roles
- FEAT-ADMN-02 Admin User Management
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-02 Sign-in and Session Management
- FEAT-AUTH-03 Password Recovery
- FEAT-AUTH-04 Google Sign-in (Optional)
- FEAT-LIST-01 List Management
- FEAT-PROF-01 Profile Management
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-UXP-01 App Shell, Theme and Instant Feedback
- FEAT-UXP-02 Public Landing Page

## Data Classification / Retention
Security-sensitive (DATA-002). Only the hash is stored. Retention: TTL at expiry; deleted with the account (EP-PROF-09).

## Source Reference
- Planned file: `src/auth/session.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `sessions`

## Open Questions
- None

## Source References
- Features: FEAT-ADMN-01, FEAT-ADMN-02, FEAT-AUTH-01, FEAT-AUTH-02, FEAT-AUTH-03, FEAT-AUTH-04, FEAT-LIST-01, FEAT-PROF-01, FEAT-PROF-02, FEAT-UXP-01, FEAT-UXP-02
- Data register: DATA-002
- Workflows: WF-002
- Business rules: BR-003, BR-028, BR-038
- Integrations: None
