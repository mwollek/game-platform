# ADR 0003: Game client stack (2D + React embedding)

## Status

Accepted

## Context

Browser games run inside the Next.js shell (see [ADR 0001](./0001-architecture-stack.md)). Milestone **M2** is the first playable title (Snake): client-only grid logic, keyboard controls, win/lose states—no persistence yet. Implementation is often AI-assisted; this ADR gives a **concrete default** so contributors and models align on patterns.

## Decision

### Default stack for simple 2D titles (e.g. M2 Snake)

- **Rendering:** **HTML Canvas 2D** (`CanvasRenderingContext2D`). No extra dependency required for the first titles.
- **Game loop:** **`requestAnimationFrame`**, or a **fixed timestep** with an accumulator if deterministic ticks are preferred.
- **React’s role:** **Shell only**—layout, buttons (Start / Retry), overlays (score, victory/defeat). Do **not** drive per-frame game state through React props/state; that causes unnecessary re-renders.
- **Where game state lives:** **Refs** (`useRef`) and/or plain TypeScript modules next to the canvas component. Update React state only on **discrete events** (e.g. round end), not every frame.

### Next.js constraints

- Game UI and canvas run in the **browser only**. Mark the mounting component with **`"use client"`**.
- Avoid SSR for the active game loop; keep canvas and listeners inside client components.

### Platform integration contract (prepare for M4+)

Expose a small imperative API so the shell can mount games consistently, for example:

- `mount(container: HTMLElement, options?: { onEnd?: (result: GameEndPayload) => void })`
- `unmount()` (remove listeners, cancel animation frames, clear the container)

Exact types live in code; the pattern is: **React wraps layout; the game engine is mounted into a DOM node** (or owns a single canvas inside it).

### Input

- Use **`keydown` / `keyup`** on `window` (or a focused element) as needed; call **`preventDefault`** where appropriate to avoid scrolling the page.
- Always **remove listeners** and cancel the loop in cleanup (e.g. `useEffect` return).

### When to add a library (optional, later)

| Library         | Use when                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| **PixiJS**      | Many sprites, layers, scaling; richer 2D without rewriting the “React = shell, canvas = engine” split.         |
| **Phaser**      | Multiple full scenes, tilemaps, heavy tooling—usually **more than needed** for the first simple titles.        |
| **react-konva** | Declarative React tree per drawable—often **worse fit** for fast grid games like Snake than one canvas + refs. |

Default remains **plain Canvas 2D** until a title clearly needs a library.

### Testing

- Extract **pure functions** for grid movement, collisions, apple placement, win/lose rules—**unit-test with Vitest** (no canvas required).
- Canvas rendering and full input flows: defer to **E2E** (e.g. Playwright) if needed; JSDOM is weak for canvas.

## Consequences

- Consistent, low-dependency path for M2 and similar 2D games.
- Clear performance story: React is not on the hot path every frame.
- Shell routes (e.g. `/games/[slug]`) can adopt the same mount/unmount pattern without rewriting game internals.

## Related

- `docs/ROADMAP.md` — M2 (Snake), M4 (game slot), M5 (scores).
- [ADR 0001](./0001-architecture-stack.md) — monolith and high-level “client-side 2D” decision.
- [ADR 0002](./0002-ui-visual-language.md) — shell visual language.
