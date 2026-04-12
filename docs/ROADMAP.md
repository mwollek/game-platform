# Game platform — roadmap and milestones

This document is the **source of truth** for implementation order. Update it when scope or priorities change.

## What we agreed (summary)

| Topic                | Choice                                                            |
| -------------------- | ----------------------------------------------------------------- |
| Platform             | Simple **2D browser games** embedded in a web shell               |
| Architecture         | **Next.js monolith** (App Router), TypeScript                     |
| Features (core)      | Auth, **per-game scores**, **leaderboards**                       |
| Future               | **Multiplayer** — planned extension, not part of early milestones |
| Docs / code language | **English**; ADRs in `docs/adr/`                                  |

Details: [ADR 0001](./adr/0001-architecture-stack.md).

---

## Milestones

### M0 — Repository and standards

**Goal:** Empty project is bootstrapped and conventions are fixed.

- [x] Initialize Next.js (App Router, TypeScript, ESLint; align with team preferences e.g. `src/`).
- [x] Add Prettier (or rely on ESLint only — pick one and document in README).
- [x] Root `README.md`: how to run locally, env vars overview.
- [ ] Optional: CI skeleton (lint on PR) — can slip to M1 if preferred.

**Exit criteria:** `pnpm dev` / `npm run dev` runs; lint passes on a clean tree. _(Met for core items; optional CI still open.)_

---

### M1 — Database and configuration

**Goal:** Persistent layer exists before feature work depends on it.

- [ ] Choose and add ORM + PostgreSQL connection (local via Docker or hosted dev DB).
- [ ] Migration workflow documented (create/apply migrations).
- [ ] Environment variables documented (`.env.example`).

**Exit criteria:** App connects to DB; at least one trivial migration applies cleanly.

---

### M2 — Authentication

**Goal:** Users can sign up / sign in; sessions are secure and usable from server and client.

- [ ] Integrate auth library (Auth.js or provider per ADR follow-up).
- [ ] Protected routes or server-side checks for “logged-in only” areas.
- [ ] Minimal profile placeholder (e.g. display name).

**Exit criteria:** A test user can register/login/logout; protected shell page is inaccessible when logged out.

---

### M3 — Platform shell and game slot

**Goal:** Navigation and a stable place to mount games.

- [ ] Layout: home, game list (can be static at first), account area.
- [ ] Route pattern for games, e.g. `/games/[slug]`.
- [ ] One **placeholder** mini-game or animation proving client bundle loads (no scoring yet).

**Exit criteria:** Logged-in user opens a game route and sees the placeholder; UX is coherent with the rest of the app.

---

### M4 — Scoring and leaderboards (first vertical slice)

**Goal:** One real game loop with server-stored scores.

- [ ] DB models: `Game`, `Score` (or equivalent) with indexes for leaderboard queries.
- [ ] Server action or route handler: **submit score** (authenticated, validate payload, rate-limit basics).
- [ ] API or server components: **fetch leaderboard** for a game.
- [ ] Replace placeholder with a **minimal real game** (e.g. clicker or snake-lite) that submits a score on game over.

**Exit criteria:** Scores persist; leaderboard shows top N for that game; only authenticated users can submit.

---

### M5 — Hardening and polish

**Goal:** Ready for casual use and iteration.

- [ ] Error states and empty leaderboards.
- [ ] Basic abuse protection: stricter validation, rate limits, optional daily/weekly boards (if desired).
- [ ] Smoke tests for critical paths (auth + submit score) if test stack is adopted.

**Exit criteria:** No known critical gaps for single-player scoring MVP.

---

### M6 — Multiplayer (future — do not start until M5 is stable)

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

| Date       | Change                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| 2026-04-12 | Initial roadmap and ADR 0001 alignment                                         |
| 2026-04-12 | M0: Next.js app shell, `/api/health`, README tooling note                      |
| 2026-04-12 | Prettier (semicolons, tabs width 4), `eslint-config-prettier`, `.editorconfig` |
