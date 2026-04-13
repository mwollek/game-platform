# Game platform — roadmap and milestones

This document is the **source of truth** for implementation order. Update it when scope or priorities change.

## What we agreed (summary)

| Topic                | Choice                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Platform             | Simple **2D browser games** embedded in a web shell                                                                     |
| Architecture         | **Next.js monolith** (App Router), TypeScript                                                                           |
| Features (core)      | Auth, **per-game scores**, **leaderboards**                                                                             |
| Future               | **Multiplayer** — planned extension, not part of early milestones                                                       |
| UI / visual language | **Light**, **pastel**, **emoji-first** game tiles; teen-friendly English — [ADR 0002](./adr/0002-ui-visual-language.md) |
| Docs / code language | **English**; ADRs in `docs/adr/`                                                                                        |

Details: [ADR 0001](./adr/0001-architecture-stack.md), [ADR 0002](./adr/0002-ui-visual-language.md).

---

## Milestones

### M0 — Repository and standards

**Status: complete** (2026-04-12) — all items below checked; exit criteria met.

**Goal:** Empty project is bootstrapped and conventions are fixed.

- [x] Initialize Next.js (App Router, TypeScript, ESLint; align with team preferences e.g. `src/`).
- [x] Add Prettier (or rely on ESLint only — pick one and document in README).
- [x] Root `README.md`: how to run locally, env vars overview (none required yet for local dev; M1 adds `.env.example`).
- [x] CI on PR/push: `.github/workflows/cicd.yml` — lint, tests, build (plus CD placeholder on `main`).

**Exit criteria:** `pnpm dev` / `npm run dev` runs; lint passes on a clean tree; CI green on PR/push. _(Met.)_

---

### M1 — Database and configuration

**Status: complete** (2026-04-13) — all items below checked; exit criteria met.

**Goal:** Persistent layer exists before feature work depends on it.

- [x] Choose and add ORM + PostgreSQL connection (local via Docker or hosted dev DB). _(Prisma + PostgreSQL in `docker-compose.yml` / `docker-compose.dev.yml`; client in `src/lib/prisma.ts`.)_
- [x] Migration workflow documented (create/apply migrations). _(See README: **Database and migrations**.)_
- [x] Environment variables documented (`.env.example`). _(Includes `DATABASE_URL`.)_

**Exit criteria:** App connects to DB; at least one trivial migration applies cleanly. _(Met: `GET /api/health` probes the DB; `prisma/migrations/20260412120000_init` applies.)_

---

### M2 — Snake (first playable title)

**Goal:** Client-side **Snake** with fixed rules—no persistence or auth required yet.

- [ ] Core loop: grid, snake movement, apple spawn, step/tick timing.
- [ ] **Controls:** **WASD** and **arrow keys** (equivalent mapping).
- [ ] **Win:** eating **5 apples** completes the round (victory state).
- [ ] **Growth:** each eaten apple **adds one segment** to the snake.
- [ ] **Loss:** collision with a **wall** ends the game (defeat state).

**Exit criteria:** From a cold start, a player can move, lose on wall collision, win after five apples, and see length increase by one per apple. _(Self-collision optional; not required for this milestone.)_

---

### M3 — Authentication

**Goal:** Users can sign up / sign in; sessions are secure and usable from server and client.

- [ ] Integrate auth library (Auth.js or provider per ADR follow-up).
- [ ] Protected routes or server-side checks for “logged-in only” areas.
- [ ] Minimal profile placeholder (e.g. display name).

**Exit criteria:** A test user can register/login/logout; protected shell page is inaccessible when logged out.

---

### M4 — Platform shell and game slot

**Goal:** Navigation and a stable place to mount games (including **Snake** from M2).

- [ ] Layout: home, game list (can be static at first), account area.
- [ ] Route pattern for games, e.g. `/games/[slug]`.
- [ ] Mount **Snake** on its slug route; coherent UX with the rest of the app (no new placeholder required if M2 is done).

**Exit criteria:** Logged-in user opens the Snake game route and plays; shell navigation and styling match platform conventions.

---

### M5 — Scoring and leaderboards (first vertical slice)

**Goal:** Server-stored scores for the existing Snake title.

- [ ] DB models: `Game`, `Score` (or equivalent) with indexes for leaderboard queries.
- [ ] Server action or route handler: **submit score** (authenticated, validate payload, rate-limit basics).
- [ ] API or server components: **fetch leaderboard** for a game.
- [ ] **Snake** submits a score on **game over** and on **win** (five apples), using the same game identity as in the catalog.

**Exit criteria:** Scores persist; leaderboard shows top N for Snake; only authenticated users can submit.

---

### M6 — Hardening and polish

**Goal:** Ready for casual use and iteration.

- [ ] Error states and empty leaderboards.
- [ ] Basic abuse protection: stricter validation, rate limits, optional daily/weekly boards (if desired).
- [ ] Smoke tests for critical paths (auth + submit score) if test stack is adopted.

**Exit criteria:** No known critical gaps for single-player scoring MVP.

---

### M7 — Multiplayer (future — do not start until M6 is stable)

**Goal:** Real-time play; exact design in a new ADR.

- [ ] ADR: transport (WebSocket service vs managed realtime), authority model.
- [ ] Matchmaking / rooms (even if minimal).
- [ ] Integrate first multiplayer title behind a feature flag.

**Exit criteria:** Defined per ADR when this milestone is opened.

---

## How to use this file

1. Implement **in order** unless a later task is blocked — then note the blocker here.
2. When a milestone completes, check the boxes and/or add a short “Done” note with date.
3. If you change stack or scope, update **ADR 0001** or add a new ADR and adjust this roadmap.

---

## Revision history

| Date       | Change                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-04-12 | Initial roadmap and ADR 0001 alignment                                                                                         |
| 2026-04-12 | M0: Next.js app shell, `/api/health`, README tooling note                                                                      |
| 2026-04-12 | Prettier (semicolons, tabs width 4), `eslint-config-prettier`, `.editorconfig`                                                 |
| 2026-04-12 | M0 closed: CI workflow (lint + test + build); roadmap exit criteria updated                                                    |
| 2026-04-13 | M1: Prisma + Postgres (Docker), `.env.example`, init migration, health DB check; README **Database and migrations**; M1 closed |
| 2026-04-13 | Insert **M2 — Snake**; renumber former M2–M6 → **M3–M7**; align M4/M5 with Snake                                               |
