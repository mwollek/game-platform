# Game platform

A web platform for simple 2D browser games: accounts, per-game scores, and leaderboards. Built with **Next.js** (see [ADR 0001](docs/adr/0001-architecture-stack.md)).

## Docs

- **[Roadmap & milestones](docs/ROADMAP.md)** — implementation order (source of truth)
- **[ADR 0001 — Architecture](docs/adr/0001-architecture-stack.md)**

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

```bash
npm run build   # production build
npm run start   # run production server
npm run lint
npm run format        # Prettier write
npm run format:check  # Prettier check (CI)
```

## Docker

Postgres is not wired up yet; these stacks only run the Next.js app.

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

For stable hot reload on Windows bind mounts, the dev stack uses polling (`WATCHPACK_POLLING` and `CHOKIDAR_USEPOLLING`); you can still fall back to `npm run dev` on the host without Docker.
