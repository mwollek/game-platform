# ADR 0004: Authentication (Auth.js, credentials, JWT sessions)

## Status

Accepted

## Context

The platform needs accounts before per-game scores and leaderboards ([roadmap M3](../ROADMAP.md)). We already use **Next.js App Router**, **PostgreSQL**, and **Prisma** ([ADR 0001](./0001-architecture-stack.md)). Auth must work from **server components**, **route handlers**, and a small amount of **client UI** (sign-in form).

## Decision

- **Library:** **Auth.js** (`next-auth` v5 beta) as the integrated Next.js auth layer.
- **Sign-in method (MVP):** **Email + password** via the **Credentials** provider.
- **Password storage:** **bcrypt** (via `bcryptjs`) with cost factor **12**, stored as `User.passwordHash` in PostgreSQL.
- **Session strategy:** **JWT** (no `Session` / `Account` tables for OAuth yet). This keeps middleware-edge concerns simple and matches credentials-only MVP; OAuth can add `@auth/prisma-adapter` models in a later change.
- **User record:** Prisma `User` with `email` (unique), optional `name` (display name), and `passwordHash`.
- **Protection:** **Server-side** checks with `auth()` — e.g. `/account` uses a layout that `redirect()`s anonymous users to `/login?callbackUrl=/account`. (No Edge `middleware` that imports Prisma.)
- **Environment:** `AUTH_SECRET` (required in production), optional `AUTH_URL` for absolute URLs in non-inferred hosts.

## Consequences

- **Pros:** Fits the monolith, minimal moving parts, easy local testing, clear path to OAuth and/or DB-backed sessions later.
- **Cons:** JWT session claims for `name` are **not** updated until the user signs in again; the **account page** reads the latest `name` from the database for display and editing.
- **Security note:** Credentials provider is appropriate for MVP; rate limiting and stricter policies belong in later hardening ([roadmap M6](../ROADMAP.md)).

## Related

- [ADR 0001](./0001-architecture-stack.md) — stack and auth follow-up.
- [ADR 0002](./0002-ui-visual-language.md) — shell styling for auth screens.
- `docs/ROADMAP.md` — milestone M3.
