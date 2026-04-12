# ADR 0002: UI visual language (light, pastel, teen-friendly)

## Status

Accepted

## Context

The platform shell is the first thing users and contributors see. An earlier iteration used a **dark, “fintech dashboard”** aesthetic (heavy charcoal, neon accents, technical chrome). The product goal is a **light, playful hub** for simple browser games, aimed at a **teen-friendly** tone—not a banking or ops console.

Work is often done with **AI assistance**; without a written baseline, new UI can drift back to dark/neutral corporate patterns or mix Polish/English copy inconsistently.

## Decision

### Mode and baseline

- **Default theme:** **Light mode** for the public shell. Do not force `class="dark"` on `<html>` unless we add an explicit user-controlled theme later.
- **Global background:** Warm off-white / soft cool tint is acceptable (see implementation in `src/app/globals.css` and hero layers in `src/app/page.tsx`). Avoid pure flat `#ffffff` for the full viewport unless a specific screen needs it.

### Color and atmosphere

- **Palette:** **Pastel** accents (mint/teal, lavender/violet, peach/amber, soft sky) on **white or near-white** surfaces. Use **slate** tones for primary text (`slate-900` / `slate-600`), not pure black on large areas.
- **Cards and panels:** Rounded corners (**~`rounded-2xl`** for primary cards), **light borders** (pastel-tinted, e.g. `border-emerald-200`, `border-violet-200`), **soft shadows** (low contrast, colored tint optional)—not harsh `shadow-black/40` slabs.
- **Hover:** Subtle **lift** (`translate-y`) and slightly stronger shadow; avoid aggressive scale or neon glow unless it is a deliberate game-specific effect.

### Game presentation

- **Primary game marks:** Use **emoji** in the shell for game tiles (e.g. snake 🐍, invaders 👾, ping pong 🏓) as the main visual identifier. Prefer **one emoji per game** in the card header area; keep them large enough to read (`text-2xl`–`text-3xl` range on tiles).
- **Optional badges:** Small pill labels (`hot`, `new`, `2P`, etc.) are fine if they stay **uppercase, short, pastel-backed**—do not overcrowd the card.
- **Icons library (Lucide, etc.):** Use for **chrome** (settings, navigation) if needed; avoid replacing emoji-first game tiles unless we add a dedicated illustration set later.

### Copy and language

- **UI copy:** **English only** for user-visible strings in the shell (titles, descriptions, buttons, health labels).
- **Tone:** **Casual and inviting** (“pick a game”, “jump in”, “coming soon”)—still clear and professional. Avoid enterprise or banking wording (“dashboard”, “solution”, “leverage”) in the main game area.

### Technical / health UI

- The **health endpoint block** should feel **friendly and light**, not a terminal: pastel container, clear status (e.g. “API online” when healthy), **Refresh** action. JSON may remain for developers but should sit in a **soft, readable** `<pre>` (light background, enough contrast).

### Implementation anchors (reference)

When extending the shell, follow existing patterns in:

- `src/app/page.tsx` — layout, hero card, background blobs
- `src/app/games-panel.tsx` — game grid, emoji tiles, badges, CTA
- `src/app/health-status.tsx` — status panel states
- `src/lib/games.ts` — game list metadata (titles/descriptions in English)

## Consequences

- New pages and components should **extend** this language (pastel + light + emoji where games are listed) rather than introducing a second dark or corporate theme without a new ADR.
- **Accessibility:** Emoji are decorative in tiles (`aria-hidden` on the emoji span is acceptable when the **game title** is present as visible text). If we add icon-only controls elsewhere, provide **accessible names**.
- **Theming:** A future dark mode or high-contrast mode should be a **deliberate** follow-up (tokens + ADR update), not ad hoc `dark:` classes mixed without a system.

## Related

- [ADR 0001](./0001-architecture-stack.md) — stack and repo conventions.
- [ROADMAP](../ROADMAP.md) — milestones; UI work should stay aligned with this ADR unless scope changes.
