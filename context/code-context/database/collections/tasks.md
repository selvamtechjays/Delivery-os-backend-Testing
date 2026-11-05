---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-TASK-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/tasks/task.model.ts"
generated_at: 2026-11-05
---

# Entity: tasks

## Entity ID
ENT-TASK-01

## Summary
A user's tasks with their manual position, soft-delete state and an embedded flat checklist. Realises DATA-005 and, as the `checklist` array, DATA-006.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
DATA-005, DATA-006 (shared-context/data.md) - the business entities this realises.

## Purpose
A user's tasks with their manual position, soft-delete state and an embedded flat checklist. Realises DATA-005 and, as the `checklist` array, DATA-006.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| userId | ObjectId | required | denormalised for owner scoping and the admin boundary (BR-017) | Assumed |
| listId | ObjectId | required | exactly one list (BR-009) | Confirmed (DATA-005) |
| title | string | required, 1-200 |  | Confirmed (BR-034) |
| notes | string | nullable, <= 2000 |  | Confirmed (BR-034) |
| dueDate | string (YYYY-MM-DD) | nullable | date-only, evaluated in the user's time zone (BR-014) | Confirmed (DATA-005) |
| dueTime | string (HH:mm) | nullable | only when dueDate set (BR-034) | Confirmed (DATA-005) |
| priority | enum low\|medium\|high | default medium | BR-035 | Confirmed (DATA-005) |
| completed | boolean | default false |  | Confirmed (DATA-005) |
| completedAt | date | nullable |  | Confirmed (DATA-005) |
| position | double | required | manual order within the list (DEC-083) | Confirmed (DATA-005); Assumed (numeric scheme) |
| checklist | array<{ id, text, done }> | max 20 | flat checklist (BR-033), order = array order | Confirmed (DATA-006) |
| deletedAt | date | nullable | soft delete for Undo (BR-011) | Assumed |
| purgeAt | date | nullable | deletedAt + 60s; TTL removes the document | Assumed (DEC-082) |
| createdAt, updatedAt | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Index: `{ userId:1, listId:1, deletedAt:1, position:1 }` (list view)
- Index: `{ userId:1, dueDate:1 }` (smart views, digest)
- Text index on `title`, `notes` (search, optional)
- TTL index on `purgeAt` (expireAfterSeconds 0)

## Relationships
- N-1 lists (ENT-LIST-01)
- N-1 users (ENT-AUTH-01)

## Used by Endpoints
- EP-PROF-06 GET /api/v1/me/export (R) - ../../backend/domains/profile/endpoints/export-my-data.md
- EP-PROF-09 (Schedule) account-purge-sweep (W) - ../../backend/domains/profile/endpoints/account-purge-sweep.md
- EP-LIST-01 GET /api/v1/lists (R) - ../../backend/domains/lists/endpoints/list-lists.md
- EP-LIST-04 DELETE /api/v1/lists/:listId (W) - ../../backend/domains/lists/endpoints/delete-list.md
- EP-TASK-01 POST /api/v1/tasks (W) - ../../backend/domains/tasks/endpoints/create-task.md
- EP-TASK-02 GET /api/v1/lists/:listId/tasks (R) - ../../backend/domains/tasks/endpoints/list-tasks-in-list.md
- EP-TASK-03 GET /api/v1/tasks/:taskId (R) - ../../backend/domains/tasks/endpoints/get-task.md
- EP-TASK-04 PATCH /api/v1/tasks/:taskId (W) - ../../backend/domains/tasks/endpoints/update-task.md
- EP-TASK-05 DELETE /api/v1/tasks/:taskId (W) - ../../backend/domains/tasks/endpoints/delete-task.md
- EP-TASK-06 POST /api/v1/tasks/:taskId/restore (W) - ../../backend/domains/tasks/endpoints/restore-task.md
- EP-TASK-07 PUT /api/v1/tasks/:taskId/checklist (W) - ../../backend/domains/tasks/endpoints/replace-checklist.md
- EP-VIEW-01 GET /api/v1/search/tasks (R) - ../../backend/domains/views/endpoints/search-tasks.md
- EP-VIEW-02 GET /api/v1/views/tasks (R) - ../../backend/domains/views/endpoints/smart-view-tasks.md
- EP-VIEW-03 POST /api/v1/tasks/:taskId/reposition (W) - ../../backend/domains/views/endpoints/reposition-task.md
- EP-NOTF-02 (Schedule) daily-digest-sweep (R) - ../../backend/domains/notifications/endpoints/daily-digest-sweep.md

## Used by Features
- FEAT-LIST-01 List Management
- FEAT-NOTF-01 Daily Digest Email
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)
- FEAT-TASK-02 Checklist Inside a Task (Optional)
- FEAT-UXP-01 App Shell, Theme and Instant Feedback
- FEAT-VIEW-01 Manual Ordering and Sorting
- FEAT-VIEW-02 Task Search, Filters and Completed Toggle

## Data Classification / Retention
Private user content: admins must never see it (BR-017). Not in analytics. Deleted with the account.

## Source Reference
- Planned file: `src/tasks/task.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `tasks`

## Open Questions
- OQ-TASK-01 | DATA-005 lists 'completed flag/time' but the register has no notes on a separate checklist collection; we embedded DATA-006 (max 20 items). Confirm no cross-task checklist queries are needed | BA | Schema shape | Open

## Source References
- Features: FEAT-LIST-01, FEAT-NOTF-01, FEAT-PROF-02, FEAT-TASK-01, FEAT-TASK-02, FEAT-UXP-01, FEAT-VIEW-01, FEAT-VIEW-02
- Data register: DATA-005, DATA-006
- Workflows: WF-006, WF-007
- Business rules: BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-016, BR-033, BR-034, BR-035
- Integrations: None
