---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-ADMN-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/admin/admin-account.model.ts"
generated_at: 2026-11-05
---

# Entity: admin_accounts

## Entity ID
ENT-ADMN-01

## Summary
Operator accounts, separate from user accounts, with a Super Admin or Admin role (BR-037).

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
None. No DATA-### counterpart (see OQ-ADMN-01).

## Purpose
Operator accounts, separate from user accounts, with a Super Admin or Admin role (BR-037).

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| name | string | required |  | Assumed |
| email | string | required, unique | distinct namespace from users.email | Assumed |
| passwordHash | string | required | argon2id | Assumed (DEC-079) |
| role | enum super-admin\|admin | required | BR-037 | Confirmed |
| createdBy | ObjectId | nullable | null for the CLI-seeded first Super Admin | Assumed |
| createdAt, updatedAt | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Unique: `email`

## Relationships
- 1-N sessions via ENT-AUTH-02 (subjectType admin)
- 1-N audit_log (actor)

## Used by Endpoints
- EP-ADMN-01 POST /api/v1/admin/auth/signin (R) - ../../backend/domains/admin/endpoints/admin-sign-in.md
- EP-ADMN-03 GET /api/v1/admin/auth/me (R) - ../../backend/domains/admin/endpoints/admin-get-current.md
- EP-ADMN-04 GET /api/v1/admin/admins (R) - ../../backend/domains/admin/endpoints/list-admins.md
- EP-ADMN-05 POST /api/v1/admin/admins (W) - ../../backend/domains/admin/endpoints/create-admin.md
- EP-ADMN-06 PATCH /api/v1/admin/admins/:adminId (W) - ../../backend/domains/admin/endpoints/change-admin-role.md
- EP-ADMN-07 DELETE /api/v1/admin/admins/:adminId (W) - ../../backend/domains/admin/endpoints/remove-admin.md
- EP-ADMN-12 (CLI) seed-super-admin (W) - ../../backend/domains/admin/endpoints/seed-super-admin.md

## Used by Features
- FEAT-ADMN-01 Admin Access and Roles
- FEAT-ADMN-02 Admin User Management

## Data Classification / Retention
PII (staff name/email). Credentials hashed; never returned.

## Source Reference
- Planned file: `src/admin/admin-account.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `admin_accounts`

## Open Questions
- None

## Source References
- Features: FEAT-ADMN-01, FEAT-ADMN-02
- Data register: None
- Workflows: WF-009
- Business rules: BR-037
- Integrations: None
