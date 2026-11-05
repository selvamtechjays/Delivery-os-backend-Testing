---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-LIST-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/lists/list.model.ts"
generated_at: 2026-11-05
---

# Entity: lists

## Entity ID
ENT-LIST-01

## Summary
A user's task lists: the default 'My Tasks' plus custom lists with a persisted order. Realises DATA-004.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
DATA-004 (shared-context/data.md) - the business entity this realises.

## Purpose
A user's task lists: the default 'My Tasks' plus custom lists with a persisted order. Realises DATA-004.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| userId | ObjectId | required |  | Confirmed (DATA-004) |
| name | string | required, 1-100 | unique per user, case-insensitive (BR-032) | Confirmed (BR-045) |
| isDefault | boolean | default false | exactly one true per user (BR-008) | Confirmed (DATA-004) |
| position | int | required | default list is 0; custom lists 1..n (BR-045) | Confirmed (DATA-004) |
| createdAt, updatedAt | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Unique: `{ userId:1, nameLower:1 }`
- Unique partial: `{ userId:1 }` where `isDefault:true`
- Index: `{ userId:1, position:1 }`

## Relationships
- N-1 users (ENT-AUTH-01)
- 1-N tasks (ENT-TASK-01)

## Used by Endpoints
- EP-AUTH-01 POST /api/v1/auth/signup (W) - ../../backend/domains/auth/endpoints/sign-up.md
- EP-AUTH-10 POST /api/v1/auth/google (W) - ../../backend/domains/auth/endpoints/google-sign-in.md
- EP-PROF-06 GET /api/v1/me/export (R) - ../../backend/domains/profile/endpoints/export-my-data.md
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md
- EP-LIST-01 GET /api/v1/lists (R) - ../../backend/domains/lists/endpoints/list-lists.md
- EP-LIST-02 POST /api/v1/lists (W) - ../../backend/domains/lists/endpoints/create-list.md
- EP-LIST-03 PATCH /api/v1/lists/:listId (W) - ../../backend/domains/lists/endpoints/rename-list.md
- EP-LIST-04 DELETE /api/v1/lists/:listId (W) - ../../backend/domains/lists/endpoints/delete-list.md
- EP-LIST-05 PUT /api/v1/lists/order (W) - ../../backend/domains/lists/endpoints/reorder-lists.md
- EP-TASK-01 POST /api/v1/tasks (R) - ../../backend/domains/tasks/endpoints/create-task.md
- EP-TASK-02 GET /api/v1/lists/:listId/tasks (R) - ../../backend/domains/tasks/endpoints/list-tasks-in-list.md
- EP-TASK-04 PATCH /api/v1/tasks/:taskId (R) - ../../backend/domains/tasks/endpoints/update-task.md
- EP-VIEW-01 GET /api/v1/search/tasks (R) - ../../backend/domains/views/endpoints/search-tasks.md

## Used by Features
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-04 Google Sign-in (Optional)
- FEAT-LIST-01 List Management
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)
- FEAT-UXP-01 App Shell, Theme and Instant Feedback
- FEAT-VIEW-01 Manual Ordering and Sorting
- FEAT-VIEW-02 Task Search, Filters and Completed Toggle

## Data Classification / Retention
User content. Deleted with the account (BR-024).

## Source Reference
- Planned file: `src/lists/list.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `lists`

## Open Questions
- None

## Source References
- Features: FEAT-AUTH-01, FEAT-AUTH-04, FEAT-LIST-01, FEAT-PROF-02, FEAT-TASK-01, FEAT-UXP-01, FEAT-VIEW-01, FEAT-VIEW-02
- Data register: DATA-004
- Workflows: WF-001, WF-006
- Business rules: BR-008, BR-032, BR-045
- Integrations: None
