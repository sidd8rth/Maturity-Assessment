# Airtel Secure — Security Maturity Self-Assessment (React)

The React version of the maturity assessment. Same content, scoring, and tier logic as the static HTML version next to this folder — rebuilt with proper component architecture and smooth motion.

## Stack

- **Vite + React 18 + TypeScript** — fast dev server, type-safe data model
- **Tailwind CSS** — utility-first styling, design tokens in `tailwind.config.js` matching Airtel b2b.css
- **Framer Motion** — layout-aware animations (the "push down when content expands" effect)

## Run

```bash
cd react-app
npm install
npm run dev
```

Dev server: <http://localhost:5173>

## Build

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build
```

## Folder layout

```
src/
├── App.tsx                 — stage machine (intro → industry → quiz → results)
├── main.tsx                — React entry
├── index.css               — Tailwind + tier-pill palette
├── types.ts                — shared TS interfaces
├── data/                   — all content (questions, weights, stacks, threats, tier copy)
├── lib/                    — pure scoring + recommendation logic
├── components/             — small reusable bits (Header, Footer, OptionTile, ScoreRing, etc.)
└── screens/                — IntroScreen, IndustryScreen, QuizScreen, ResultsScreen
```

## What's animated

- **Option selection** — option grid uses `motion.div layout`; selecting an answer causes the auto-advance bar to appear and the layout reflows smoothly (the "push down" effect)
- **Question transitions** — slide+fade between questions via `AnimatePresence`
- **Score ring fill** — animated stroke-dashoffset on results
- **Number counter** — score animates from 0 → final value with eased curve
- **Domain bars** — stagger in left-to-right, then widths animate
- **Threat cards & recommendations** — stagger in on results render
- **Plain English toggle** — sub-text smoothly cross-fades when switched
- **View toggle (Business / CISO)** — pill slides between options via shared `layoutId`
- **Tier message** — cross-fades when view changes

## Logic parity with the HTML version

- Same 12 questions, same `s: 1..4` scoring scale
- Same per-industry weights (`src/data/weights.ts`)
- Same normalisation: `((avg - 1) / 3) * 100` per domain, then weighted sum
- Same tier thresholds: `< 35 Basic`, `< 60 Developing`, `< 80 Established`, `≥ 80 Advanced`
- Same recommendation engine — weakest-weighted-domain-driven for Basic/Developing/Established, and the hand-picked `ADVANCED_PICKS` per industry for Advanced
- Same tier-aware CTA copy (`TIER_CTA`) and view-aware tier message (`TIER_MESSAGES`)
- Same plain-English sub-text for jargon-heavy questions

## Notes

- `xs:` breakpoint isn't built into Tailwind by default — components use `sm:` (≥640px) as the smallest breakpoint instead. If you want an `xs` (≥480px) breakpoint, add it under `theme.extend.screens` in `tailwind.config.js`.
- The Airtel Sans font loads from Airtel's CDN — needs internet to render correctly; falls back to system sans-serif offline.
