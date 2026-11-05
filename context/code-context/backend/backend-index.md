---
doc_type: endpoint-index
schema_version: 1.3
produced_by: tl
layer: backend
origin: designed
repo: backend
status: Emerging
generated_at: 2026-11-05
---

# Backend Index - tasknest API

53 endpoints across 9 domains (all `Proposed` except EP-UXP-01, which exists in the scaffold). Stack and conventions: ./_overview.md

## Domain Map

Read this first. Find your domain here, then jump to its rows in **Units** below.

### Authentication - `AUTH` - 11 endpoints - ./domains/auth/
Account creation and the identity lifecycle: sign-up, email verification (and its resend), sign-in with remember-me and lockout, log-out of one or all devices, session bootstrap (`/auth/me`), password reset, and optional Google sign-in with email-ownership linking.
**Touches:** `users`, `sessions`, `email_tokens`, `linked_identities`, `lists` (default list at sign-up).
**Not here:** Profile maintenance -> Profile. Admin sign-in -> Admin.

### Profile & Account - `PROF` - 9 endpoints - ./domains/profile/
What a signed-in user can do to their own account: name, photo, password, email change, preferences (theme, digest, time zone), data export, deletion request, recovery during the 30-day window, and the daily purge job.
**Touches:** `users`, `sessions`, `email_tokens`, `lists`, `tasks`, `deletion_tombstones`.
**Not here:** Sign-in and tokens -> Authentication.

### Lists - `LIST` - 5 endpoints - ./domains/lists/
Read, create, rename, delete and reorder a user's lists; deleting moves tasks to My Tasks.
**Touches:** `lists`, `tasks`.
**Not here:** The tasks themselves -> Tasks.

### Tasks - `TASK` - 7 endpoints - ./domains/tasks/
Task CRUD with optimistic-friendly PATCH, soft delete with Undo, per-list reads and the flat checklist; enforces the unverified 5-task cap.
**Touches:** `tasks`, `lists`, `users`.
**Not here:** Cross-list search/filters and manual reorder -> Views.

### Views (Order, Search, Filters) - `VIEW` - 3 endpoints - ./domains/views/
Read-only cross-list queries (search, Today/This week/Overdue/Priority) and the manual drag-and-drop reposition write.
**Touches:** `tasks`, `users` (time zone).
**Not here:** Task create/edit -> Tasks.

### Notifications & Email - `NOTF` - 3 endpoints - ./domains/notifications/
Single internal email entry (templated, outbox-backed), the hourly daily-digest sweep and the outbox retry sweep. No browser-facing routes.
**Touches:** `email_outbox`, `digest_log`, `users`, `tasks`.
**Not here:** Who triggers an email -> the owning domain.

### Admin - `ADMN` - 12 endpoints - ./domains/admin/
Admin sign-in/out, admin account management (Super Admin), user counts, user search, disable/enable, and the launch CLI that seeds the first Super Admin. Never exposes task or credential data.
**Touches:** `admin_accounts`, `audit_log`, `users`, `sessions`.
**Not here:** End-user sign-in -> Authentication.

### Analytics & Consent - `ANLY` - 2 endpoints - ./domains/analytics/
Persist and read the cookie-consent decision; GA4 itself is client-side and not an endpoint.
**Touches:** `consent_records`.
**Not here:** Erasure on account deletion -> Profile purge sweep.

### Platform - `UXP` - 1 endpoint - ./domains/platform/
Operational surfaces: the health probe used for availability monitoring.
**Touches:** None.

## Units

One row per endpoint. `Summary` is copied verbatim from the unit file's `## Summary`.

| Endpoint ID | Method + Path | Domain | Summary | Called by | Reads/Writes Entities | Used by Features | File |
|---|---|---|---|---|---|---|---|
| EP-AUTH-01 | POST /api/v1/auth/signup | Authentication | Create an unverified account from name, email and password, create the default 'My Tasks' list, start a session and send the verification email. | PAGE-AUTH-01 (frontend) | users (W), lists (W), sessions (W), email_tokens (W) | FEAT-AUTH-01, FEAT-LIST-01 | ./domains/auth/endpoints/sign-up.md |
| EP-AUTH-02 | POST /api/v1/auth/verify-email | Authentication | Consume a single-use email token to mark the account email verified, or to switch the account email after an email-change request. | PAGE-AUTH-03 (frontend) | email_tokens (RW), users (W) | FEAT-AUTH-01, FEAT-PROF-01 | ./domains/auth/endpoints/verify-email.md |
| EP-AUTH-03 | POST /api/v1/auth/resend-verification | Authentication | Issue a fresh verification link for the signed-in unverified user; rate-limited. | PAGE-AUTH-03 (frontend), PAGE-TASK-01 (frontend), PAGE-UXP-01 (frontend) | users (R), email_tokens (W) | FEAT-AUTH-01, FEAT-TASK-01 | ./domains/auth/endpoints/resend-verification.md |
| EP-AUTH-04 | POST /api/v1/auth/signin | Authentication | Authenticate by email and password, enforce the 15-minute lockout, and start a session (remembered 30 days or short). | PAGE-AUTH-02 (frontend) | users (RW), sessions (W) | FEAT-ADMN-02, FEAT-AUTH-02 | ./domains/auth/endpoints/sign-in.md |
| EP-AUTH-05 | POST /api/v1/auth/signout | Authentication | Revoke only the current session and clear the cookies. | PAGE-UXP-01 (frontend) | sessions (W) | FEAT-AUTH-02 | ./domains/auth/endpoints/sign-out.md |
| EP-AUTH-06 | POST /api/v1/auth/signout-all | Authentication | Revoke every active session of the user, including remembered ones. | PAGE-PROF-01 (frontend) | sessions (W) | FEAT-AUTH-02 | ./domains/auth/endpoints/sign-out-all.md |
| EP-AUTH-07 | GET /api/v1/auth/me | Authentication | Return the signed-in user's profile, verification state, preferences and usage limits; also refreshes the CSRF cookie. The app shell polls it so a verification done on another device clears the banner. | PAGE-PROF-01 (frontend), PAGE-UXP-01 (frontend), PAGE-UXP-02 (frontend) | sessions (R), users (R) | FEAT-AUTH-01, FEAT-AUTH-02, FEAT-PROF-01, FEAT-UXP-01, FEAT-UXP-02 | ./domains/auth/endpoints/get-current-user.md |
| EP-AUTH-08 | POST /api/v1/auth/forgot-password | Authentication | Email a one-hour reset link if the account exists, always responding neutrally. | PAGE-AUTH-04 (frontend), PAGE-AUTH-05 (frontend) | users (R), email_tokens (W) | FEAT-AUTH-03 | ./domains/auth/endpoints/forgot-password.md |
| EP-AUTH-09 | POST /api/v1/auth/reset-password | Authentication | Set a new password with a valid reset token, end every other session and email a confirmation. | PAGE-AUTH-05 (frontend) | email_tokens (RW), users (W), sessions (W) | FEAT-AUTH-03 | ./domains/auth/endpoints/reset-password.md |
| EP-AUTH-10 | POST /api/v1/auth/google | Authentication | Accept a Google ID token from the client, verify it, then create, sign in or start account linking. | PAGE-AUTH-01 (frontend), PAGE-AUTH-02 (frontend) | users (RW), linked_identities (RW), lists (W), sessions (W), email_tokens (W) | FEAT-AUTH-04 | ./domains/auth/endpoints/google-sign-in.md |
| EP-AUTH-11 | POST /api/v1/auth/google/link-confirm | Authentication | Complete linking a Google identity to an existing email/password account after the user proves ownership of the email. | PAGE-AUTH-03 (frontend) | email_tokens (RW), linked_identities (W), users (W), sessions (W) | FEAT-AUTH-04 | ./domains/auth/endpoints/google-link-confirm.md |
| EP-PROF-01 | PATCH /api/v1/me | Profile & Account | Change the signed-in user's display name. | PAGE-PROF-01 (frontend) | users (W) | FEAT-PROF-01 | ./domains/profile/endpoints/update-profile.md |
| EP-PROF-02 | POST /api/v1/me/photo | Profile & Account | Upload or replace the profile photo (JPG, JPEG, PNG, WebP up to 5 MB). | PAGE-PROF-01 (frontend) | users (W) | FEAT-PROF-01 | ./domains/profile/endpoints/upload-photo.md |
| EP-PROF-03 | POST /api/v1/me/password | Profile & Account | Change password after proving the current one; end all other sessions and email a confirmation. | PAGE-PROF-01 (frontend) | users (RW), sessions (W) | FEAT-PROF-01 | ./domains/profile/endpoints/change-password.md |
| EP-PROF-04 | POST /api/v1/me/email | Profile & Account | Start an email change: send a verification link to the new address while the old one stays active. | PAGE-PROF-01 (frontend) | users (R), email_tokens (W) | FEAT-PROF-01 | ./domains/profile/endpoints/request-email-change.md |
| EP-PROF-05 | PATCH /api/v1/me/preferences | Profile & Account | Update theme, digest on/off and the time zone used for the daily digest. | PAGE-PROF-01 (frontend), PAGE-UXP-01 (frontend) | users (W) | FEAT-NOTF-01, FEAT-PROF-01, FEAT-UXP-01 | ./domains/profile/endpoints/update-preferences.md |
| EP-PROF-06 | GET /api/v1/me/export | Profile & Account | Download the user's personal data as JSON or CSV (allowed for unverified users too). | PAGE-PROF-02 (frontend) | users (R), lists (R), tasks (R) | FEAT-PROF-02 | ./domains/profile/endpoints/export-my-data.md |
| EP-PROF-07 | POST /api/v1/me/deletion | Profile & Account | Confirm deletion: end all sessions, disable access immediately, mark the account for permanent deletion in 30 days, and email a confirmation. | PAGE-PROF-02 (frontend) | users (RW), sessions (W) | FEAT-PROF-02 | ./domains/profile/endpoints/request-account-deletion.md |
| EP-PROF-08 | POST /api/v1/auth/recover-account | Profile & Account | Cancel a pending deletion within 30 days by signing in and confirming identity; all data is restored. | PAGE-AUTH-02 (frontend) | users (RW), sessions (W) | FEAT-PROF-02 | ./domains/profile/endpoints/recover-account.md |
| EP-PROF-09 | (Schedule) account-purge-sweep | Profile & Account | Permanently delete all data of accounts whose 30-day recovery window has elapsed and record a tombstone so a backup restore cannot resurrect them. | Trigger: Schedule (daily) | users (RW), sessions (W), email_tokens (W), linked_identities (W), lists (W), tasks (W), consent_records (W), deletion_tombstones (W) | FEAT-ANLY-01, FEAT-PROF-02, FEAT-UXP-03 | ./domains/profile/endpoints/account-purge-sweep.md |
| EP-LIST-01 | GET /api/v1/lists | Lists | Return the user's lists in display order (My Tasks first, then custom lists by saved order) with open-task counts. | PAGE-LIST-01 (frontend), PAGE-TASK-01 (frontend), PAGE-TASK-02 (frontend), PAGE-VIEW-01 (frontend), PAGE-UXP-01 (frontend) | lists (R), tasks (R) | FEAT-LIST-01, FEAT-TASK-01, FEAT-UXP-01, FEAT-VIEW-02 | ./domains/lists/endpoints/list-lists.md |
| EP-LIST-02 | POST /api/v1/lists | Lists | Create a custom list (verified users only). | PAGE-LIST-01 (frontend) | lists (W) | FEAT-LIST-01 | ./domains/lists/endpoints/create-list.md |
| EP-LIST-03 | PATCH /api/v1/lists/:listId | Lists | Rename a custom list. | PAGE-LIST-01 (frontend) | lists (W) | FEAT-LIST-01 | ./domains/lists/endpoints/rename-list.md |
| EP-LIST-04 | DELETE /api/v1/lists/:listId | Lists | Delete a custom list after moving every task in it to My Tasks. | PAGE-LIST-01 (frontend) | lists (W), tasks (W) | FEAT-LIST-01 | ./domains/lists/endpoints/delete-list.md |
| EP-LIST-05 | PUT /api/v1/lists/order | Lists | Persist the drag-and-drop order of custom lists; My Tasks always stays first. | PAGE-LIST-01 (frontend) | lists (W) | FEAT-LIST-01 | ./domains/lists/endpoints/reorder-lists.md |
| EP-TASK-01 | POST /api/v1/tasks | Tasks | Create a task at the top of a list from a title (and optional fields); enforces the unverified 5-task cap. | PAGE-TASK-01 (frontend) | tasks (W), lists (R), users (R) | FEAT-TASK-01 | ./domains/tasks/endpoints/create-task.md |
| EP-TASK-02 | GET /api/v1/lists/:listId/tasks | Tasks | Return a list's tasks in manual order or sorted as a view, optionally including completed tasks. | PAGE-TASK-01 (frontend) | tasks (R), lists (R) | FEAT-TASK-01, FEAT-VIEW-01, FEAT-VIEW-02 | ./domains/tasks/endpoints/list-tasks-in-list.md |
| EP-TASK-03 | GET /api/v1/tasks/:taskId | Tasks | Return one task with its checklist. | PAGE-TASK-02 (frontend) | tasks (R) | FEAT-TASK-01, FEAT-TASK-02 | ./domains/tasks/endpoints/get-task.md |
| EP-TASK-04 | PATCH /api/v1/tasks/:taskId | Tasks | Partially update a task: title, notes, due date/time, priority, completion state, or the list it belongs to. | PAGE-TASK-01 (frontend), PAGE-TASK-02 (frontend), PAGE-VIEW-01 (frontend) | tasks (W), lists (R) | FEAT-TASK-01, FEAT-VIEW-02 | ./domains/tasks/endpoints/update-task.md |
| EP-TASK-05 | DELETE /api/v1/tasks/:taskId | Tasks | Delete a task; it can be restored only via Undo for 10 seconds. | PAGE-TASK-01 (frontend), PAGE-TASK-02 (frontend) | tasks (W) | FEAT-TASK-01 | ./domains/tasks/endpoints/delete-task.md |
| EP-TASK-06 | POST /api/v1/tasks/:taskId/restore | Tasks | Restore a just-deleted task within the 10-second Undo window. | PAGE-TASK-01 (frontend), PAGE-TASK-02 (frontend) | tasks (W) | FEAT-TASK-01 | ./domains/tasks/endpoints/restore-task.md |
| EP-TASK-07 | PUT /api/v1/tasks/:taskId/checklist | Tasks | Replace the task's flat checklist (add, remove, tick, reorder in one idempotent write). | PAGE-TASK-02 (frontend) | tasks (W) | FEAT-TASK-02 | ./domains/tasks/endpoints/replace-checklist.md |
| EP-VIEW-01 | GET /api/v1/search/tasks | Views (Order, Search, Filters) | Search the user's tasks across all lists by title and notes. | PAGE-VIEW-01 (frontend) | tasks (R), lists (R) | FEAT-VIEW-02 | ./domains/views/endpoints/search-tasks.md |
| EP-VIEW-02 | GET /api/v1/views/tasks | Views (Order, Search, Filters) | Return tasks matching one smart filter across all lists. | PAGE-VIEW-01 (frontend) | tasks (R), users (R) | FEAT-VIEW-02 | ./domains/views/endpoints/smart-view-tasks.md |
| EP-VIEW-03 | POST /api/v1/tasks/:taskId/reposition | Views (Order, Search, Filters) | Persist a drag-and-drop move within a list without touching sort views. | PAGE-TASK-01 (frontend) | tasks (W) | FEAT-VIEW-01 | ./domains/views/endpoints/reposition-task.md |
| EP-ADMN-01 | POST /api/v1/admin/auth/signin | Admin | Dedicated sign-in for admin accounts (separate from user accounts). | PAGE-ADMN-01 (frontend) | admin_accounts (R), sessions (W) | FEAT-ADMN-01 | ./domains/admin/endpoints/admin-sign-in.md |
| EP-ADMN-02 | POST /api/v1/admin/auth/signout | Admin | End the admin session. | PAGE-ADMN-02 (frontend) | sessions (W) | FEAT-ADMN-01, FEAT-ADMN-02 | ./domains/admin/endpoints/admin-sign-out.md |
| EP-ADMN-03 | GET /api/v1/admin/auth/me | Admin | Return the signed-in admin and role so the UI can hide Super-Admin-only actions. | PAGE-ADMN-02 (frontend), PAGE-ADMN-03 (frontend) | sessions (R), admin_accounts (R) | FEAT-ADMN-01, FEAT-ADMN-02 | ./domains/admin/endpoints/admin-get-current.md |
| EP-ADMN-04 | GET /api/v1/admin/admins | Admin | List admin accounts and roles. | PAGE-ADMN-03 (frontend) | admin_accounts (R) | FEAT-ADMN-01 | ./domains/admin/endpoints/list-admins.md |
| EP-ADMN-05 | POST /api/v1/admin/admins | Admin | A Super Admin creates an admin account and assigns a role. | PAGE-ADMN-03 (frontend) | admin_accounts (W), audit_log (W) | FEAT-ADMN-01 | ./domains/admin/endpoints/create-admin.md |
| EP-ADMN-06 | PATCH /api/v1/admin/admins/:adminId | Admin | Change an admin's role. | PAGE-ADMN-03 (frontend) | admin_accounts (W), sessions (W), audit_log (W) | FEAT-ADMN-01 | ./domains/admin/endpoints/change-admin-role.md |
| EP-ADMN-07 | DELETE /api/v1/admin/admins/:adminId | Admin | Remove an admin account. | PAGE-ADMN-03 (frontend) | admin_accounts (W), sessions (W), audit_log (W) | FEAT-ADMN-01 | ./domains/admin/endpoints/remove-admin.md |
| EP-ADMN-08 | GET /api/v1/admin/users/stats | Admin | Return total registered accounts with verified, unverified, disabled and deletion-pending counts. | PAGE-ADMN-02 (frontend) | users (R) | FEAT-ADMN-02 | ./domains/admin/endpoints/user-stats.md |
| EP-ADMN-09 | GET /api/v1/admin/users | Admin | Find users by name or email and return basic account details only. | PAGE-ADMN-02 (frontend) | users (R) | FEAT-ADMN-02 | ./domains/admin/endpoints/search-users.md |
| EP-ADMN-10 | POST /api/v1/admin/users/:userId/disable | Admin | Disable an abusive account: block sign-in, end all sessions, email the user and write an audit record. | PAGE-ADMN-02 (frontend) | users (W), sessions (W), audit_log (W) | FEAT-ADMN-02 | ./domains/admin/endpoints/disable-user.md |
| EP-ADMN-11 | POST /api/v1/admin/users/:userId/enable | Admin | Re-enable a disabled account; sign-in works again. | PAGE-ADMN-02 (frontend) | users (W), audit_log (W) | FEAT-ADMN-02 | ./domains/admin/endpoints/enable-user.md |
| EP-ADMN-12 | (CLI) seed-super-admin | Admin | One-off command run by the delivery team at launch to create the first Super Admin. | Trigger: CLI (manual, delivery team at launch, ASM-017) | admin_accounts (W) | FEAT-ADMN-01 | ./domains/admin/endpoints/seed-super-admin.md |
| EP-ANLY-01 | GET /api/v1/consent | Analytics & Consent | Return the stored consent choice for the signed-in user or the anonymous visitor id. | PAGE-UXP-01 (frontend) | consent_records (R) | FEAT-ANLY-01 | ./domains/analytics/endpoints/get-consent.md |
| EP-ANLY-02 | PUT /api/v1/consent | Analytics & Consent | Store accept/decline/withdraw with a timestamp. | PAGE-UXP-01 (frontend) | consent_records (W) | FEAT-ANLY-01 | ./domains/analytics/endpoints/set-consent.md |
| EP-NOTF-01 | (Service) send-templated-email | Notifications & Email | Single internal entry used by every flow to render a branded template and deliver it from the company domain through the Mailer port. | Trigger: Service (in-process call from EP-AUTH-01/03/08/09/10, EP-PROF-03/04/07, EP-ADMN-10, EP-NOTF-02) | email_outbox (W) | FEAT-ADMN-02, FEAT-AUTH-01, FEAT-AUTH-03, FEAT-NOTF-01, FEAT-NOTF-02, FEAT-PROF-01 | ./domains/notifications/endpoints/send-templated-email.md |
| EP-NOTF-02 | (Schedule) daily-digest-sweep | Notifications & Email | Each tick finds eligible users whose local time just reached 08:00 and sends at most one digest each per day. | Trigger: Schedule (every hour, on the hour) | users (R), tasks (R), digest_log (RW) | FEAT-NOTF-01 | ./domains/notifications/endpoints/daily-digest-sweep.md |
| EP-NOTF-03 | (Schedule) email-outbox-retry | Notifications & Email | Retry queued transactional emails that failed their first attempt. | Trigger: Schedule (every minute, Assumed) | email_outbox (RW) | FEAT-NOTF-02 | ./domains/notifications/endpoints/email-outbox-retry.md |
| EP-UXP-01 | GET /health | Platform | Liveness/readiness probe: reports process status and MongoDB connectivity; used for the 99.5% availability monitoring. | Trigger: Service (uptime monitor / load balancer probe) | - | FEAT-UXP-03 | ./domains/platform/endpoints/health-check.md |
