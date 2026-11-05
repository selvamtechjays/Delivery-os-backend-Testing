---
doc_type: code-context-readme
schema_version: 1.3
produced_by: tl
status: Emerging
generated_at: 2026-11-05
---

# Code Context

A machine-first description of this repository: pages, endpoints and database objects grouped by business domain, with the links between them. This tree is **forward-planned** (`origin: designed`) by `tl-feature-planning` for the TaskNest requirement; units become `Implemented` only after `/dev:build` and merge. Committed with the code so it diffs in review.

## How to read this (index first, please follow this order)

1. `code-context-index.md` - layers and domains, one line each.
2. The layer index (`backend/backend-index.md`, `frontend/frontend-index.md`, `database/database-index.md`) -> its **Domain Map**. Pick a domain.
3. The **Units** table in that index -> pick the unit by its one-line summary.
4. Open only that unit file.

Do not walk the folders to find something.

## What is here
| Layer | Units | Index |
|---|---|---|
| Backend | 53 endpoints across 9 domains | ./backend/backend-index.md |
| Frontend | lives in the `frontend` repo | see that repo's code-context |
| Database | 12 objects (collections) | ./database/database-index.md |

## Trust and staleness
Every unit carries a status, an `implementation_state` and a confidence per designed fact (`Confirmed`, `Assumed`, `Needs Clarification`). `Assumed` means designed by the TL to fill a gap; verify before relying on it.

## Boundaries
This describes the intended technical design, not the product requirements. Requirements live in the Delivery OS workspace (`requirements/tasknest/`).
