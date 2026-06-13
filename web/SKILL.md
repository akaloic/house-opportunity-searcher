---
name: pepite-design
description: Use this skill to generate well-branded interfaces and assets for Pépite — an automated real-estate watch ("veille immobilière") platform for Paris & Île-de-France — either for production or throwaway prototypes/mocks. Contains the dark BI/monitoring design guidelines, colors, type, fonts, assets, and UI kit components for prototyping property-scoring dashboards.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **What it is:** a dark-first BI / monitoring design system for a technical user (data scientist / DevOps). Dense, tabular, calm. French copy, fr-FR number formatting.
- **Brand idea:** graphite everywhere; **opportunity glows gold** (a *pépite* = a listing scoring ≥ 80).
- **Global CSS:** link `styles.css` (it `@import`s all tokens + fonts). Everything keys off CSS custom properties — never hard-code colors.
- **Brand colors:** brand teal `--brand-500 #2DD4A7` for all interactivity; gold `--gold-500 #F2B33D` for pépites/alerts only; score scale `--score-0…--score-100` (red→gold→teal) for gauges, bars, and the map heatmap.
- **Type:** IBM Plex Sans (UI), IBM Plex Mono (all numbers, tabular), Space Grotesk (display). 14px base.
- **Icons:** Lucide (1.75px stroke, 24px grid). No emoji.

## Using the components
React primitives are bundled and exposed on `window.PPiteDesignSystem_0c887c`. In an HTML file: link `styles.css`, load React + ReactDOM + Babel (pinned UMD), then `<script src=".../_ds_bundle.js">`, then read components in a `text/babel` block:

```js
const { Button, StatCard, ScoreGauge, ScoreRadar, Panel, Badge, RangeSlider } = window.PPiteDesignSystem_0c887c;
```

Do **not** load the `.jsx` source directly — use the bundle. See `ui_kits/pepite-dashboard/` for a complete worked example (app shell, dashboard + CSS cartography heatmap, listing deep-dive with mathematical score justification, real-time scoring-weight config, and technical monitoring). Copy `icons.jsx` and `data.js` from there when you need the icon set or mock data.

## Watch-outs
- Keep gold rare — it is the most valuable signal.
- Numbers: French formatting (`612 000 €`, `-2,1 %`, `€/m²`) and `tabular-nums`.
- Lean on hairline borders over shadows on dark surfaces.
- Avoid full-view entrance fades from `opacity:0` (they break DOM-clone screenshots); animate elements individually.
- Fonts are loaded from Google Fonts CDN as a substitution — swap in licensed binaries if self-hosting.
