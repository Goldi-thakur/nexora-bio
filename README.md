# Nexora Bio — Landing Page

A premium, editorial biotechnology landing page built around one continuous,
scroll-driven visual system: a canvas-based "living biological network" that
morphs its topology as the reader moves through the narrative.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- GSAP 3 + ScrollTrigger (scroll-based reveals, counters, section timing)
- No 3D library — the network is a hand-tuned 2D canvas engine. Three.js was
  deliberately avoided: a flat, editorial dark composition doesn't need real
  3D, and a plain canvas keeps the animation cheap enough to run continuously
  without frame drops.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build → dist/
npm run preview   # serve the production build locally
```

## Design system

- **Palette** — near-black ink (`#08090A`) base, warm paper text
  (`#F3F4F1` → `#8A9290` for hierarchy), and three restrained accents used
  with intent rather than decoration: electric mint (`#5FE3A4`) for primary
  action and the network's "front" layer, icy blue (`#8FCBE0`) for
  connective tissue (edges, secondary nodes), and a rare violet (`#A895D9`)
  reserved for the network's back layer only.
- **Type** — Fraunces (an optical-size serif) carries every headline, paired
  with Inter for body copy and IBM Plex Mono for eyebrows, labels, and all
  numerals (nav, stats, stage indices). The serif/mono contrast is the
  brand's typographic signature — editorial confidence next to
  computational precision.
- **Signature element** — `BioNetwork` (`src/utils/bioNetwork.ts`): a single
  canvas instance, persistent for the whole page, whose ~84 nodes are
  critically-damped-spring-animated toward a new target layout
  (`scatter → branch → process → converged`) every time the reader enters a
  new section. It is the same system throughout, not a hero graphic that
  gets swapped for section icons later.

## Architecture

```
src/
  components/   Navbar, Hero, Innovation, Research, Capabilities,
                Impact, FinalCTA, Footer, BioNetworkLayer
  hooks/        useReducedMotion
  data/         research.ts, capabilities.ts, stats.ts
  utils/        bioNetwork.ts (canvas engine, framework-agnostic)
```

`App.tsx` owns an `IntersectionObserver` across the eight sections and calls
`BioNetworkLayer`'s imperative `morphTo()` handle as sections enter view,
plus a finer-grained observer inside `Capabilities` that advances the
network through its four `DISCOVER → DESIGN → VALIDATE → SCALE` states as
the reader scrolls through that section specifically.

## Accessibility & performance notes

- All motion respects `prefers-reduced-motion`: the canvas disables idle
  drift, pointer parallax, and particle travel, and GSAP-based reveals still
  run but rely on the OS-level reduced-motion CSS override for duration.
- Every interactive element is reachable and operable by keyboard, with a
  visible high-contrast focus ring (`:focus-visible`).
- The canvas is `aria-hidden` and `pointer-events-none` — it is decorative
  and never blocks interaction with content above it.
- The canvas engine caps device-pixel-ratio at 2, reuses a single
  `requestAnimationFrame` loop, and cleans up all listeners and the loop on
  unmount.
