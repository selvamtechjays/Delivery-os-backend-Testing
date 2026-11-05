# Testing

Jest 30 + ts-jest + supertest. Two Jest projects defined in `jest.config.js`, which is also the single source of the coverage gate.

## Commands

| Command | What it runs |
|---|---|
| `npm test` | every project (unit + integration) |
| `npm run test:unit` | unit project: `src/**/*.spec.ts` except `*.int.spec.ts` (no database) |
| `npm run test:int` | integration project: `src/**/*.int.spec.ts` against an in-memory MongoDB |
| `npm run test:contract` | contract specs (`*.contract.spec.ts`) against `src/contract` Zod schemas |
| `npm run test:cov` | all projects with coverage; **fails below the floor** |
| `npm run audit:high` | `npm audit --audit-level=high` (fails on any high/critical) |

CI runs exactly these scripts (`.github/workflows/ci.yml`).

## Layout and conventions

- Unit specs `*.spec.ts` sit beside the source. Integration specs `*.int.spec.ts` use the in-memory MongoDB (mongodb-memory-server, standalone mongod, version pinned in `src/test-support/global-setup.ts`). Move to a replica set when the first multi-document transaction appears.
- Use the database only in integration specs. `resetDb()` runs after every integration test. Never connect to a real database or read `.env` in tests.
- External dependencies are ports in `src/ports` (`Mailer`, `Clock`, `OAuthVerifier`, `Storage`), passed to `createApp(corsOrigins, deps)` and to job functions. Tests use the in-memory fakes in `src/test-support/fakes`, and Jest fake timers for lockout and scheduler windows.
- Test data comes from plain typed builders in `src/test-support/builders` (counter-based, no randomness). The shapes there are placeholders; replace them with the real domain types.
- Jobs are plain run-once functions; tests call them directly. Cover double delivery and retry exhaustion for every job. See `src/test-support/examples/run-once.ts` for the pattern (a harness example, not a product job).
- Contract: `src/contract` Zod schemas are the single source of truth for response shapes. Any change to an endpoint contract changes the schema and its contract spec in the same PR.
- Do not use `.skip` or `.only`.

## Coverage floor

Global thresholds in `jest.config.js`: statements 78, lines 78, branches 50 (measured, rounded down; OD-2). The ratchet target is 80 / 60 after the first feature lands. The floor only moves up; any change goes through a `DEC-###`.

## Security scans and baseline

- `npm audit --audit-level=high` runs in CI. Baseline at setup: 0 critical, 0 high, 22 moderate, 4 low (all in the Jest dev-dependency chain). The gate fails only on a new high or critical. Fix the existing findings with `/dev:build --vulnerable repo=backend`, not in unrelated PRs.
- gitleaks runs in CI on the full history; the pre-commit hook runs it on staged changes when it is installed locally.
- Hooks: husky `pre-commit` (lint-staged: prettier check + eslint on staged files, gitleaks) and `pre-push` (typecheck).
