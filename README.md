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
