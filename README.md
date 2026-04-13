# Game platform

A web platform for simple 2D browser games: accounts, per-game scores, and leaderboards. Built with **Next.js** (see [ADR 0001](docs/adr/0001-architecture-stack.md)).

## Docs

- **[Roadmap & milestones](docs/ROADMAP.md)** — implementation order (source of truth)
- **[ADR 0001 — Architecture](docs/adr/0001-architecture-stack.md)**
- **[ADR 0004 — Authentication](docs/adr/0004-authentication.md)**

## Tooling

- **Lint:** ESLint (`npm run lint`).
- **Format:** Prettier — semicolons, **tabs** (width 4). Run `npm run format` or `npm run format:check`. Config: `prettier.config.mjs`.

## Local setup

Requirements: **Node.js 20+** and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health JSON: [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Authentication

Set **`AUTH_SECRET`** in `.env` (see [`.env.example`](.env.example)) — use a long random value locally and a unique secret in production. Then:

1. Apply DB migrations so the `User` table exists (`npm run db:migrate` or `npm run db:migrate:dev`).
2. Open **Register** in the header, create an account, and **Sign in**.
3. **`/account`** is only available when signed in; otherwise you are redirected to `/login`.

Details: [ADR 0004 — Authentication](docs/adr/0004-authentication.md).

```bash
npm run build   # production build
npm run start   # run production server
npm run lint
npm run format        # Prettier write
npm run format:check  # Prettier check (CI)
```

## Database and migrations

The app uses **PostgreSQL** with **Prisma**. Connection string: **`DATABASE_URL`** (see [`.env.example`](.env.example)).

**On the host (Postgres already running, e.g. local install):**

1. Copy env: `cp .env.example .env` and adjust `DATABASE_URL` if needed.
2. Apply migrations: `npm run db:migrate` (deploy existing migrations) or, when you change `prisma/schema.prisma`, create/apply in dev with `npm run db:migrate:dev`.
3. Regenerate client after schema changes: `npm run db:generate` (also runs on `npm install` via `postinstall`).

**With Docker dev stack** (`docker-compose.dev.yml`): Postgres and the app start together; the app container receives `DATABASE_URL` automatically. After the stack is up, apply migrations inside the app container:

```bash
npm run docker:dev:migrate
```

That runs `prisma migrate deploy` against the compose Postgres service.

**Create a new migration** (typical flow on the host): edit `prisma/schema.prisma`, then:

```bash
npm run db:migrate:dev
```

Prisma will create a folder under `prisma/migrations/` and apply it. Commit that folder. In CI/production-like deploys, use `npm run db:migrate` (or the Docker equivalent above) so only existing migrations run.

**Check connectivity:** [http://localhost:3000/api/health](http://localhost:3000/api/health) includes a database probe (`database: "ok"` when the pool can run `SELECT 1`).

## Docker

Compose files run **Next.js and PostgreSQL** (the app waits for Postgres to be healthy before starting).

### Production-like (standalone build)

```bash
npm run docker:up:build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run docker:up
npm run docker:up:build -- -d
npm run docker:down
npm run docker:logs
```

### Local development (hot reload)

Uses `next dev` with the repo bind-mounted into the container. `node_modules` live in a named volume so Linux binaries stay consistent inside Docker. Stop the production-like container first — both use port `3000`.

```bash
npm run docker:dev:build
```

Useful commands:

```bash
npm run docker:dev:up
npm run docker:dev:build -- -d
npm run docker:dev:down
npm run docker:dev:logs
```

The dev entrypoint runs **`npm install` when `package.json` / `package-lock.json` change** (tracked via a stamp under `node_modules`), so new dependencies are picked up after a pull. If anything still looks wrong, rebuild the dev image (`npm run docker:dev:build`) and restart the stack; as a last resort remove the named volume `app_dev_node_modules` for this compose project so dependencies install clean.

For stable hot reload on Windows bind mounts, the dev stack uses polling (`WATCHPACK_POLLING` and `CHOKIDAR_USEPOLLING`); you can still fall back to `npm run dev` on the host without Docker.
