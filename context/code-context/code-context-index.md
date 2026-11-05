---
doc_type: code-context-index
schema_version: 1.3
produced_by: tl
status: Emerging
repo: backend
layers: [backend, database]
generated_at: 2026-11-05
---

# Code Context Index - backend

## What this repository is
Node/Express REST API over MongoDB for TaskNest, a personal to-do web app: accounts and sessions, lists, tasks, daily digest email, admin, consent. The web client lives in the `frontend` repo.

## Layers
| Layer | Present | Units | Index |
|---|---|---|---|
| Backend (endpoints, jobs, CLI) | yes | 53 | ./backend/backend-index.md |
| Frontend (pages) | no, separate repo `frontend` | - | `C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/frontend/context/code-context/frontend/frontend-index.md` |
| Database (collections) | yes | 12 | ./database/database-index.md |

## Domains
| Domain | Area | One-line meaning | Backend | Database objects |
|---|---|---|---|---|
| Authentication | AUTH | Account creation and the identity lifecycle: sign-up, email verification (and its resend), sign-in with remember-me and lockout, log-out of one or all devices, session bootstrap (`/auth/me`), password reset, and optional Google sign-in with email-ownership linking. | 11 endpoints | 4 |
| Profile & Account | PROF | What a signed-in user can do to their own account: name, photo, password, email change, preferences (theme, digest, time zone), data export, deletion request, recovery during the 30-day window, and the daily purge job. | 9 endpoints | 1 |
| Lists | LIST | Read, create, rename, delete and reorder a user's lists; deleting moves tasks to My Tasks. | 5 endpoints | 1 |
| Tasks | TASK | Task CRUD with optimistic-friendly PATCH, soft delete with Undo, per-list reads and the flat checklist; enforces the unverified 5-task cap. | 7 endpoints | 1 |
| Views (Order, Search, Filters) | VIEW | Read-only cross-list queries (search, Today/This week/Overdue/Priority) and the manual drag-and-drop reposition write. | 3 endpoints | 0 |
| Notifications & Email | NOTF | Single internal email entry (templated, outbox-backed), the hourly daily-digest sweep and the outbox retry sweep. | 3 endpoints | 2 |
| Admin | ADMN | Admin sign-in/out, admin account management (Super Admin), user counts, user search, disable/enable, and the launch CLI that seeds the first Super Admin. | 12 endpoints | 2 |
| Analytics & Consent | ANLY | Persist and read the cookie-consent decision; GA4 itself is client-side and not an endpoint. | 2 endpoints | 1 |
| Platform | UXP | Operational surfaces: the health probe used for availability monitoring. | 1 endpoints | 0 |

## Coverage and confidence
Forward-planned for all 19 TaskNest features; nothing mapped from code except EP-UXP-01 (`/health`). See open questions on each unit.

## Cross-repo
Endpoints are consumed by pages in the `frontend` repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/frontend`). Wiring: Frontend -> Backend over REST (`.jetrix/connection-map.md`). Cross-repo links in unit files are relative paths that resolve when both repos sit side by side in the workspace.
