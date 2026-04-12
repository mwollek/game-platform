# ADR 0001: Next.js monolith and initial stack

## Status

Accepted

## Context

We are building a web platform for simple 2D browser games with user accounts, per-game scoring and leaderboards, and a future path to multiplayer. The project is developed with heavy AI assistance; documentation and code are in English.

## Decision

- **Application shape:** A **Next.js monolith** (App Router) as the primary deliverable: UI shell, authentication, score APIs, and game embedding in one repository.
- **Language:** **TypeScript** end-to-end.
- **Data:** **PostgreSQL** with a schema managed via migrations (ORM TBD in implementation phase — e.g. Prisma or Drizzle).
- **Auth:** Use a solution that fits Next.js well (e.g. Auth.js / NextAuth or a hosted provider). Exact choice is a follow-up ADR when implementation starts.
- **Games:** Client-side 2D (Canvas or a thin library). Each game is a **separate module** loaded by the platform shell, not mixed with server-only code.
- **Multiplayer (later):** Not implemented in the first milestones. When needed, add a **dedicated real-time service** or a managed real-time layer; do not block MVP on WebSocket design inside the Next serverless runtime.
- **Testing stack:** Use **Vitest** + **React Testing Library** for component and UI-state tests, with **MSW** for deterministic HTTP mocking in tests.

## Consequences

- Faster MVP and a single deployment unit.
- Clear boundary: **HTTP + DB** in Next; **real-time** is an explicit future extension.
- Leaderboards and score submission remain **server-validated** (no trust in raw client scores beyond basic checks).
- CI enforces quality gates: lint + tests must pass before production build and CD steps run.

## Related

- `docs/ROADMAP.md` — milestones and execution order.
- [ADR 0002](./0002-ui-visual-language.md) — UI visual language for the shell (light, pastel, copy tone).
