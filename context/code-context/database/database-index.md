---
doc_type: entity-index
schema_version: 1.3
produced_by: tl
layer: database
origin: designed
repo: backend
status: Emerging
generated_at: 2026-11-05
---

# Database Index - tasknest API

12 objects: 0 tables - 0 views - 0 stored procedures - 0 functions - 0 triggers - 12 collections. Engine MongoDB via Mongoose; see ./_overview.md

## Domain Map

### Identity - 4 objects
Accounts, server-side sessions (users and admins), single-use email tokens and Google identity links. `users` also embeds preferences (DATA-007).
**Objects:** users, sessions, email_tokens, linked_identities

### Account lifecycle - 1 object
Deletion tombstones that let a backup restore re-apply permanent deletions.
**Objects:** deletion_tombstones

### Lists - 1 object
The default My Tasks list and custom lists with their order.
**Objects:** lists

### Tasks - 1 object
Tasks with manual position, soft delete for Undo and an embedded flat checklist (DATA-006).
**Objects:** tasks

### Admin - 2 objects
Operator accounts and the audit log of admin actions.
**Objects:** admin_accounts, audit_log

### Analytics & Consent - 1 object
Cookie-consent decisions. No analytics events are stored locally (DEC-087).
**Objects:** consent_records

### Notifications - 2 objects
Email outbox and the one-digest-per-day idempotency log.
**Objects:** email_outbox, digest_log

## Objects by kind

### Collections (12)
users, sessions, email_tokens, linked_identities, deletion_tombstones, lists, tasks, admin_accounts, audit_log, consent_records, email_outbox, digest_log

## Units

| Entity ID | Entity | Kind | Source DATA-### | Summary | Used by Endpoints | Used by Features | File |
|---|---|---|---|---|---|---|---|
| ENT-AUTH-01 | users | Collection | DATA-001, DATA-007 | End-user accounts: identity, credentials, verification state, lifecycle status (active, disabled, pending-deletion) and embedded preferences. Realises DATA-001 and, as the `preferences` subdocument, DATA-007. | EP-AUTH-01, EP-AUTH-02, EP-AUTH-03, EP-AUTH-04, EP-AUTH-07, EP-AUTH-08, EP-AUTH-09, EP-AUTH-10, EP-AUTH-11, EP-PROF-01, EP-PROF-02, EP-PROF-03, EP-PROF-04, EP-PROF-05, EP-PROF-06, EP-PROF-07, EP-PROF-08, EP-PROF-09, EP-TASK-01, EP-VIEW-02, EP-ADMN-08, EP-ADMN-09, EP-ADMN-10, EP-ADMN-11, EP-NOTF-02 | FEAT-ADMN-02, FEAT-ANLY-01, FEAT-AUTH-01, FEAT-AUTH-02, FEAT-AUTH-03, FEAT-AUTH-04, FEAT-LIST-01, FEAT-NOTF-01, FEAT-PROF-01, FEAT-PROF-02, FEAT-TASK-01, FEAT-UXP-01, FEAT-UXP-02, FEAT-VIEW-02 | ./collections/users.md |
| ENT-AUTH-02 | sessions | Collection | DATA-002 | Server-side sessions for users and admins; enables log-out-this-device, log-out-all and immediate revocation on disable/password change. | EP-AUTH-01, EP-AUTH-04, EP-AUTH-05, EP-AUTH-06, EP-AUTH-07, EP-AUTH-09, EP-AUTH-10, EP-AUTH-11, EP-PROF-03, EP-PROF-07, EP-PROF-08, EP-PROF-09, EP-ADMN-01, EP-ADMN-02, EP-ADMN-03, EP-ADMN-06, EP-ADMN-07, EP-ADMN-10 | FEAT-ADMN-01, FEAT-ADMN-02, FEAT-AUTH-01, FEAT-AUTH-02, FEAT-AUTH-03, FEAT-AUTH-04, FEAT-LIST-01, FEAT-PROF-01, FEAT-PROF-02, FEAT-UXP-01, FEAT-UXP-02 | ./collections/sessions.md |
| ENT-AUTH-03 | email_tokens | Collection | DATA-003 | Single-use, time-limited tokens for email verification, email change, password reset and Google link confirmation. Realises DATA-003. | EP-AUTH-01, EP-AUTH-02, EP-AUTH-03, EP-AUTH-08, EP-AUTH-09, EP-AUTH-10, EP-AUTH-11, EP-PROF-04, EP-PROF-09 | FEAT-AUTH-01, FEAT-AUTH-03, FEAT-AUTH-04, FEAT-LIST-01, FEAT-PROF-01, FEAT-PROF-02, FEAT-TASK-01 | ./collections/email-tokens.md |
| ENT-AUTH-04 | linked_identities | Collection | - | Links an external identity (Google) to a user so Google and email/password sign-in resolve to one account (BR-029). | EP-AUTH-10, EP-AUTH-11, EP-PROF-09 | FEAT-AUTH-04, FEAT-PROF-02 | ./collections/linked-identities.md |
| ENT-PROF-01 | deletion_tombstones | Collection | - | Minimal record of permanently deleted accounts so a backup restore can re-apply deletions and deleted data never reappears (BR-042). | EP-PROF-09 | FEAT-PROF-02, FEAT-UXP-03 | ./collections/deletion-tombstones.md |
| ENT-LIST-01 | lists | Collection | DATA-004 | A user's task lists: the default 'My Tasks' plus custom lists with a persisted order. Realises DATA-004. | EP-AUTH-01, EP-AUTH-10, EP-PROF-06, EP-PROF-09, EP-LIST-01, EP-LIST-02, EP-LIST-03, EP-LIST-04, EP-LIST-05, EP-TASK-01, EP-TASK-02, EP-TASK-04, EP-VIEW-01 | FEAT-AUTH-01, FEAT-AUTH-04, FEAT-LIST-01, FEAT-PROF-02, FEAT-TASK-01, FEAT-UXP-01, FEAT-VIEW-01, FEAT-VIEW-02 | ./collections/lists.md |
| ENT-TASK-01 | tasks | Collection | DATA-005, DATA-006 | A user's tasks with their manual position, soft-delete state and an embedded flat checklist. Realises DATA-005 and, as the `checklist` array, DATA-006. | EP-PROF-06, EP-PROF-09, EP-LIST-01, EP-LIST-04, EP-TASK-01, EP-TASK-02, EP-TASK-03, EP-TASK-04, EP-TASK-05, EP-TASK-06, EP-TASK-07, EP-VIEW-01, EP-VIEW-02, EP-VIEW-03, EP-NOTF-02 | FEAT-LIST-01, FEAT-NOTF-01, FEAT-PROF-02, FEAT-TASK-01, FEAT-TASK-02, FEAT-UXP-01, FEAT-VIEW-01, FEAT-VIEW-02 | ./collections/tasks.md |
| ENT-ADMN-01 | admin_accounts | Collection | - | Operator accounts, separate from user accounts, with a Super Admin or Admin role (BR-037). | EP-ADMN-01, EP-ADMN-03, EP-ADMN-04, EP-ADMN-05, EP-ADMN-06, EP-ADMN-07, EP-ADMN-12 | FEAT-ADMN-01, FEAT-ADMN-02 | ./collections/admin-accounts.md |
| ENT-ADMN-02 | audit_log | Collection | - | Append-only record of admin actions (disable/enable user, create/change/remove admin). | EP-ADMN-05, EP-ADMN-06, EP-ADMN-07, EP-ADMN-10, EP-ADMN-11 | FEAT-ADMN-01, FEAT-ADMN-02 | ./collections/audit-log.md |
| ENT-ANLY-01 | consent_records | Collection | DATA-008 | Cookie-consent decisions (choice and timestamp) per signed-in user or anonymous visitor id. Realises DATA-008. | EP-PROF-09, EP-ANLY-01, EP-ANLY-02 | FEAT-ANLY-01, FEAT-PROF-02 | ./collections/consent-records.md |
| ENT-NOTF-01 | email_outbox | Collection | - | Outbox of transactional and digest emails with delivery status, enabling retries independent of the provider (INT-001). | EP-NOTF-01, EP-NOTF-03 | FEAT-ADMN-02, FEAT-AUTH-01, FEAT-AUTH-03, FEAT-NOTF-01, FEAT-NOTF-02, FEAT-PROF-01 | ./collections/email-outbox.md |
| ENT-NOTF-02 | digest_log | Collection | - | Guarantees at most one digest per user per local day (BR-015) and records skipped-empty days. | EP-NOTF-02 | FEAT-NOTF-01 | ./collections/digest-log.md |
