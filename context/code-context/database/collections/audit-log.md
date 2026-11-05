---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-ADMN-02
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/admin/audit-log.model.ts"
generated_at: 2026-11-05
---

# Entity: audit_log

## Entity ID
ENT-ADMN-02

## Summary
Append-only record of admin actions (disable/enable user, create/change/remove admin).

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
None. No DATA-### counterpart (see OQ-ADMN-01); BR-038 requires an audit record.

## Purpose
Append-only record of admin actions (disable/enable user, create/change/remove admin).

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| actorAdminId | ObjectId | required |  | Confirmed (BR-038) |
| action | enum user.disable\|user.enable\|admin.create\|admin.role-change\|admin.remove | required |  | Confirmed (BR-038); Assumed (admin.*) |
| targetType | enum user\|admin | required |  | Assumed |
| targetId | ObjectId | required |  | Assumed |
| reason | string\|nullable | <= 500 |  | Assumed |
| at | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Index: `{ targetType:1, targetId:1, at:-1 }`

## Relationships
- N-1 admin_accounts (ENT-ADMN-01)

## Used by Endpoints
- EP-ADMN-05 POST /api/v1/admin/admins (W) - ../../backend/domains/admin/endpoints/create-admin.md
- EP-ADMN-06 PATCH /api/v1/admin/admins/:adminId (W) - ../../backend/domains/admin/endpoints/change-admin-role.md
- EP-ADMN-07 DELETE /api/v1/admin/admins/:adminId (W) - ../../backend/domains/admin/endpoints/remove-admin.md
- EP-ADMN-10 POST /api/v1/admin/users/:userId/disable (W) - ../../backend/domains/admin/endpoints/disable-user.md
- EP-ADMN-11 POST /api/v1/admin/users/:userId/enable (W) - ../../backend/domains/admin/endpoints/enable-user.md

## Used by Features
- FEAT-ADMN-01 Admin Access and Roles
- FEAT-ADMN-02 Admin User Management

## Data Classification / Retention
Contains ids and free-text reasons only; no task content. Retention undecided (OQ-ADMN-03). The target id of a purged user remains (id only).

## Source Reference
- Planned file: `src/admin/audit-log.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `audit_log`

## Open Questions
- OQ-ADMN-03 | Audit log retention and whether it must be erased when a user is purged | Legal / BA | Schema + purge | Open

## Source References
- Features: FEAT-ADMN-01, FEAT-ADMN-02
- Data register: None
- Workflows: WF-009
- Business rules: BR-037, BR-038
- Integrations: None
