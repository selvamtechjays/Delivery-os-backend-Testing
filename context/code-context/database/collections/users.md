---
doc_type: entity
schema_version: 1.3
produced_by: tl
entity_id: ENT-AUTH-01
kind: Collection
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
source_reference: "src/auth/user.model.ts"
generated_at: 2026-11-05
---

# Entity: users

## Entity ID
ENT-AUTH-01

## Summary
End-user accounts: identity, credentials, verification state, lifecycle status (active, disabled, pending-deletion) and embedded preferences. Realises DATA-001 and, as the `preferences` subdocument, DATA-007.

## Status
Proposed

## Kind
Collection (MongoDB via Mongoose, DEC-007)

## Source Data Entity
DATA-001, DATA-007 (shared-context/data.md) - the business entities this realises.

## Purpose
End-user accounts: identity, credentials, verification state, lifecycle status (active, disabled, pending-deletion) and embedded preferences. Realises DATA-001 and, as the `preferences` subdocument, DATA-007.

## Columns / Fields
| Name | Type | Constraints | Notes | Confidence |
|---|---|---|---|---|
| _id | ObjectId | PK |  | Confirmed |
| name | string | required, 1-100 |  | Confirmed (DATA-001) |
| email | string | required, unique, lower-case | login and notification address | Confirmed (DATA-001) |
| passwordHash | string | nullable | argon2id; null for Google-only accounts | Assumed (DEC-079) |
| emailVerified | boolean | default false | BR-002 | Confirmed |
| verifiedAt | date | nullable |  | Assumed |
| termsAcceptedAt | date | required for email sign-ups | BR-007 | Confirmed (DATA-001) |
| photoKey | string | nullable | storage object key; URL is signed on read (BR-031) | Assumed |
| status | enum active\|disabled\|pending-deletion | default active | BR-018, BR-024, BR-038 | Confirmed (DATA-001) |
| failedSignIns | int | default 0 | consecutive failures (BR-004) | Confirmed |
| lockedUntil | date | nullable | 15-minute lockout (BR-004) | Confirmed |
| deletionRequestedAt | date | nullable | BR-024 | Confirmed |
| purgeAt | date | nullable | deletionRequestedAt + 30 days | Confirmed |
| preferences.theme | enum system\|light\|dark | default system | BR-020 | Confirmed (DATA-007) |
| preferences.digestEnabled | boolean | default true | BR-015 | Confirmed (DATA-007) |
| preferences.timeZone | string (IANA) | default UTC | detected from browser | Confirmed (DATA-007) |
| analyticsId | string | unique, sparse | pseudonymous id for GA4 and its erasure (DEC-087) | Assumed |
| createdAt, updatedAt | date | required |  | Confirmed |

## Keys & Indexes
- PK: `_id`
- Unique: `email`
- Index: `{ status:1, purgeAt:1 }` (purge sweep)
- Index: `{ 'preferences.timeZone':1, 'preferences.digestEnabled':1 }` (digest sweep)
- Text/regex support for admin search on `name`, `email` (EP-ADMN-09)

## Relationships
- 1-N sessions (ENT-AUTH-02)
- 1-N email_tokens (ENT-AUTH-03)
- 1-N linked_identities (ENT-AUTH-04)
- 1-N lists (ENT-LIST-01)
- 1-N tasks (ENT-TASK-01) via list

## Used by Endpoints
- EP-AUTH-01 POST /api/v1/auth/signup (W) - ../../backend/domains/auth/endpoints/sign-up.md
- EP-AUTH-02 POST /api/v1/auth/verify-email (W) - ../../backend/domains/auth/endpoints/verify-email.md
- EP-AUTH-03 POST /api/v1/auth/resend-verification (R) - ../../backend/domains/auth/endpoints/resend-verification.md
- EP-AUTH-04 POST /api/v1/auth/signin (RW) - ../../backend/domains/auth/endpoints/sign-in.md
- EP-AUTH-07 GET /api/v1/auth/me (R) - ../../backend/domains/auth/endpoints/get-current-user.md
- EP-AUTH-08 POST /api/v1/auth/forgot-password (R) - ../../backend/domains/auth/endpoints/forgot-password.md
- EP-AUTH-09 POST /api/v1/auth/reset-password (W) - ../../backend/domains/auth/endpoints/reset-password.md
- EP-AUTH-10 POST /api/v1/auth/google (RW) - ../../backend/domains/auth/endpoints/google-sign-in.md
- EP-AUTH-11 POST /api/v1/auth/google/link-confirm (W) - ../../backend/domains/auth/endpoints/google-link-confirm.md
- EP-PROF-01 PATCH /api/v1/me (W) - ../../backend/domains/profile/endpoints/update-profile.md
- EP-PROF-02 POST /api/v1/me/photo (W) - ../../backend/domains/profile/endpoints/upload-photo.md
- EP-PROF-03 POST /api/v1/me/password (RW) - ../../backend/domains/profile/endpoints/change-password.md
- EP-PROF-04 POST /api/v1/me/email (R) - ../../backend/domains/profile/endpoints/request-email-change.md
- EP-PROF-05 PATCH /api/v1/me/preferences (W) - ../../backend/domains/profile/endpoints/update-preferences.md
- EP-PROF-06 GET /api/v1/me/export (R) - ../../backend/domains/profile/endpoints/export-my-data.md
- EP-PROF-07 POST /api/v1/me/deletion (RW) - ../../backend/domains/profile/endpoints/request-account-deletion.md
- EP-PROF-08 POST /api/v1/auth/recover-account (RW) - ../../backend/domains/profile/endpoints/recover-account.md
- EP-PROF-09 (Schedule) account-purge-sweep (RW) - ../../backend/domains/profile/endpoints/account-purge-sweep.md
- EP-TASK-01 POST /api/v1/tasks (R) - ../../backend/domains/tasks/endpoints/create-task.md
- EP-VIEW-02 GET /api/v1/views/tasks (R) - ../../backend/domains/views/endpoints/smart-view-tasks.md
- EP-ADMN-08 GET /api/v1/admin/users/stats (R) - ../../backend/domains/admin/endpoints/user-stats.md
- EP-ADMN-09 GET /api/v1/admin/users (R) - ../../backend/domains/admin/endpoints/search-users.md
- EP-ADMN-10 POST /api/v1/admin/users/:userId/disable (W) - ../../backend/domains/admin/endpoints/disable-user.md
- EP-ADMN-11 POST /api/v1/admin/users/:userId/enable (W) - ../../backend/domains/admin/endpoints/enable-user.md
- EP-NOTF-02 (Schedule) daily-digest-sweep (R) - ../../backend/domains/notifications/endpoints/daily-digest-sweep.md

## Used by Features
- FEAT-ADMN-02 Admin User Management
- FEAT-ANLY-01 Analytics and Cookie Consent
- FEAT-AUTH-01 Account Registration and Email Verification
- FEAT-AUTH-02 Sign-in and Session Management
- FEAT-AUTH-03 Password Recovery
- FEAT-AUTH-04 Google Sign-in (Optional)
- FEAT-LIST-01 List Management
- FEAT-NOTF-01 Daily Digest Email
- FEAT-PROF-01 Profile Management
- FEAT-PROF-02 Account Deletion and Data Export
- FEAT-TASK-01 Task Lifecycle (Add, Edit, Complete, Delete, Move)
- FEAT-UXP-01 App Shell, Theme and Instant Feedback
- FEAT-UXP-02 Public Landing Page
- FEAT-VIEW-02 Task Search, Filters and Completed Toggle

## Data Classification / Retention
PII (name, email, photo). Credential field `passwordHash` is never returned by any endpoint, never exported (EP-PROF-06) and never visible to admins (BR-017). Retention: removed by EP-PROF-09 30 days after a deletion request (BR-024).

## Source Reference
- Planned file: `src/auth/user.model.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`); Mongoose model, collection name `users`

## Open Questions
- OQ-PROF-04 | Is eventual re-registration of a purged email's analyticsId linked to the old one? | Legal | Assumed: no, new id | Open

## Source References
- Features: FEAT-ADMN-02, FEAT-ANLY-01, FEAT-AUTH-01, FEAT-AUTH-02, FEAT-AUTH-03, FEAT-AUTH-04, FEAT-LIST-01, FEAT-NOTF-01, FEAT-PROF-01, FEAT-PROF-02, FEAT-TASK-01, FEAT-UXP-01, FEAT-UXP-02, FEAT-VIEW-02
- Data register: DATA-001, DATA-007
- Workflows: WF-001, WF-002, WF-005
- Business rules: BR-001, BR-002, BR-004, BR-007, BR-015, BR-018, BR-020, BR-024, BR-038
- Integrations: None
