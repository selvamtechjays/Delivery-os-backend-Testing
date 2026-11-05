---
doc_type: endpoint
schema_version: 1.3
produced_by: tl
endpoint_id: EP-ADMN-12
method: CLI
path: "(CLI) seed-super-admin"
match_key: "CLI seed-super-admin"
status: Proposed
implementation_state: Planned
origin: designed
repo: backend
domain: admin
source_reference: "src/admin/seed-super-admin.cli.ts"
generated_at: 2026-11-05
---

# Endpoint: Seed First Super Admin (Launch Set-up)

## Endpoint ID
EP-ADMN-12

## Summary
One-off command run by the delivery team at launch to create the first Super Admin.

## Status
Proposed

## Method + Path
(CLI) seed-super-admin

## Domain
admin

## Purpose
One-off command run by the delivery team at launch to create the first Super Admin.

## Trigger
Trigger: CLI (manual, delivery team at launch, ASM-017).

## Request
None (no request body or parameters).

## Response
- Process exit code 0 and the created admin id printed; non-zero if one already exists with that email

All errors use the envelope `{ "error": { "code": string, "message": string, "details"?: object } }` (DEC-076).

## Auth
- **Token type:** None; operator-run command on the server with database access
- **Verified by:** n/a (access to the runtime environment is the control)
- **Client obtains via:** n/a
- **Header format:** n/a
- **Server extracts:** n/a
- **Failure responses:**
  - Non-zero exit code with a message if input is invalid or the admin already exists
- **Server prerequisites:** `MONGODB_URI` set; never exposed as an HTTP route
- **Permissions layered on top of authentication:** None

Confidence: Confirmed (ASM-017).

## Config prerequisites
Structured fields (every env var and external service this endpoint's chain reads at runtime):

**Env vars this endpoint's chain requires:**
- `MONGODB_URI` - required

**Services this endpoint's chain depends on being reachable:**
- MongoDB (per `shared-context/technology-stack.md`)

**Failure mode if any prerequisite is missing:**
- Missing required env var -> server fails fast at startup (config parsed once in `src/config/env.ts`)
- MongoDB unreachable -> 503 `SERVICE_UNAVAILABLE` for this endpoint (the process keeps serving `/health`, DEC-014)
- Optional env vars unset -> the stated default applies

Confidence: Assumed (design; names beyond `MONGODB_URI` and `CORS_ORIGINS` are new).

## Behaviour / Business Rules
- Reads email/name/password from args or env; creates a `super-admin` in admin_accounts (ASM-017). Never exposed over HTTP.

## Called by
- Trigger: CLI (manual, delivery team at launch, ASM-017).

## Reads / Writes Entities
- Writes admin_accounts - ../../../../database/collections/admin-accounts.md (ENT-ADMN-01)

## Integrations
- None

## Used by Features
- FEAT-ADMN-01 Admin Access and Roles

## Source Reference
- Planned file: `src/admin/seed-super-admin.cli.ts` in the backend repo (`C:/Users/selva/OneDrive/Desktop/Delivery-Os-Testing/backend`)
- Not yet written; planned location follows `shared-context/coding-standards.md` (domain folder `src/admin/`)

## Open Questions
- None

## Source References
- Features: FEAT-ADMN-01
- Workflows: WF-009
- Business rules: BR-037
- Data: None
- Integrations: None
- Decisions: DEC-078
