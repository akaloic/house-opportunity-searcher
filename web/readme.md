# Pépite — Design System

**Pépite** is the design system for an automated **real-estate watch ("veille immobilière")** platform focused on **Paris & Île-de-France**. The product scrapes listing sites (Leboncoin, SeLoger, PAP, Bien'ici…), scores every listing on a weighted multi-criteria model (prix/m² vs quartier, transports, fraîcheur, potentiel DPE, étage, nuisances), and surfaces the best deals — the *pépites* (gold nuggets) — through alerts and an analytical dashboard.

The user is **technical** — a data scientist / DevOps engineer. They want **control, information density, and speed**, not a B2C marketing site. Pépite is therefore a **dark-first BI / monitoring** system: graphite surfaces, tabular numerics everywhere, one interactive brand color, and a gold accent reserved for opportunity.

> **The name.** *Pépite* = gold nugget, French slang for a great find. The whole interface is cool graphite; **opportunity literally glows gold.** A listing only earns gold treatment when it scores ≥ 80. Use gold sparingly — it is the most valuable signal in the system.

---

## Sources & provenance

This system was authored **greenfield** from a product brief (no existing codebase or Figma was attached). It is an original design, not a recreation of any third-party product. There is therefore no upstream repo or Figma link to credit; if you later connect a real back-end or Figma, record the links here.

- **Brief:** UI/UX for an automated IDF/Paris property-watch dashboard for a Data/DevOps user — four views (Dashboard + cartographie, Fiche détail, Moteur de scoring, Monitoring technique), advanced data-viz, dark mode.
- **Status:** Foundations + components + one full UI kit. See the index at the bottom.

---

## Content fundamentals

**Language:** French (fr-FR). All product copy, labels, and microcopy are French. Numbers use French formatting — space as thousands separator (`2 481`, `612 000 €`), comma as decimal (`-2,1 %`), `€/m²`.

**Tone:** terse, technical, factual. This is an instrument panel, not a brochure. Labels are nouns or short noun phrases (`Score moyen`, `Requêtes bloquées`, `Pondération du scoring`). No exclamation, no salesy adjectives, no second-person address. The interface states facts and lets the analyst judge.

**Casing:**
- Section titles / panel headers: sentence case (`Cartographie des opportunités`, `Justification du score`).
- Micro-labels / eyebrows: UPPERCASE with wide tracking, used for KPI labels and table column heads (`PÉPITES · 24H`, `SOURCE`, `SCANNÉES`).
- Data values: mono, tabular.

**Person:** impersonal/imperative for actions (`Enregistrer la config`, `Relancer`, `Voir l'annonce`). Never "you/your".

**Vocabulary:** a *pépite* is a listing scoring ≥ 80. Other tiers: `Bon plan` (≥ 60), `Moyen`, `Surcoté` (over market). Scores are `/100`. Criteria are referenced by short names: `Prix/m²`, `Transports`, `Fraîcheur`, `DPE`, `Étage`, `Calme`.

**Emoji:** none. This is a technical tool — emoji would break the register. Status is shown with colored dots, badges, and icons, never emoji.

**Examples (real copy from the kit):**
- KPI labels: `Pépites · 24h`, `Annonces scannées`, `Prix médian /m²`, `Taux de succès`.
- Justification: `score = Σ ( critère × poids normalisé )`.
- Log lines: `Annonce PP-4821 scorée 92 → match alerte « Belleville T3 »`, `HTTP 403 · challenge Datadome détecté · backoff 240s`.
- Market verdict: `38 000 € sous le marché estimé`.

---

## Visual foundations

**Mood:** a Bloomberg-terminal-meets-observability-dashboard. Calm, dark, dense, precise. Easy on the eyes for long analytical sessions.

**Color.** Dark-first. Five-step graphite surface ramp from `--bg-sunken` (`#06080C`, log/map wells) through `--bg-base` (`#0A0D13`, app) to `--surface-4` (`#28303C`, active). One **brand teal-emerald** (`--brand-500 #2DD4A7`) carries all interactivity (focus, active nav, primary buttons, selection). One **gold** (`--gold-500 #F2B33D`) is the *pépite* accent — opportunity, alerts, the best scores. A full semantic set (success/warning/danger/info) and an 8-color categorical `--viz-*` palette drive charts. A sequential **score scale** runs red → gold → teal (`--score-0` … `--score-100`); the same stops power the map heatmap (`--heat-gradient`). Tokens live in `tokens/colors.css`.

**Type.** `IBM Plex Sans` for UI/body, `IBM Plex Mono` for every number that matters (prices, €/m², scores, coordinates, logs, latencies — anything tabular), `Space Grotesk` for display (big KPI numbers, the wordmark). Base size is **14px** (BI density). Numbers always use `font-variant-numeric: tabular-nums`. UPPERCASE eyebrows carry `--tracking-caps` (0.10em). Loaded from Google Fonts CDN — see the substitution note below.

**Spacing.** 4px base grid, tight by intent (`--space-*`). Default panel padding 14px, card padding 16px. Layout tokens fix the sidebar (248px), topbar (56px), and content max (1600px).

**Backgrounds.** Flat dark fills, no photographic or gradient hero backgrounds. The only "imagery" is functional: the **map** is drawn in CSS (street grid via layered linear-gradients, the Seine as a translucent band, parks as soft green patches, a screen-blended heatmap of `--score`-colored radial blobs, score pins). Log/map/code wells use the darkest `--bg-sunken`. No textures, no patterns, no decorative gradients.

**Borders & cards.** The system **leans on hairline borders, not shadows** (dark UIs read borders better). `--border-subtle` separates same-level surfaces; `--border-default`/`--border-strong` for inputs and emphasis. Cards = `--surface-1` + 1px `--border-subtle` + `--radius-lg` (12px) + a faint `--shadow-1`. Radii: inputs/badges 6–8px, cards 12px, pills 999px, gauges/dots round. Elevation shadows are subtle and only appear on hover/overlays. A `glow` card variant adds `--glow-gold` for a featured pépite.

**Animation.** Functional and quick. Eases: `--ease-out` (most), `--ease-spring` (switch knob). Durations 90–320ms. Score bars/gauges animate their fill on mount (`--dur-slow`). Status dots **pulse** (`pepite-ping`) for live/online states. No bounce on content, no parallax, no infinite decorative loops. (Note: avoid full-view entrance fades that start at `opacity:0` — they break DOM-clone screenshot capture; animate individual elements instead.)

**Hover / press.** Buttons brighten on hover (`filter: brightness`) and nudge down + scale 0.99 on press. Ghost/secondary controls hover to a lighter surface. Nav and rows hover to `--surface-2`; the active item gets a `--brand-soft` fill + a 2px inset brand bar on the left. Icon buttons swap color/background on hover.

**Transparency & blur.** Used only for chrome that floats over the map (legend, badges) — `rgba(10,13,19,0.82)` + `backdrop-filter: blur(8px)`. Soft-tint backgrounds (`--brand-soft`, `--gold-soft`, semantic `*-soft`) fill badges, active states, and verdict callouts.

**Imagery vibe.** Property photos are represented as neutral placeholder blocks (graphite gradient + image glyph) — the real product fills these from listings. There is no brand photography; the aesthetic is cool, dark, instrument-like.

**Focus.** 2px `--focus-ring` (teal at 45% alpha) outline, 2px offset, plus a 3px soft ring on text inputs/selects. Keyboard-visible only (`:focus-visible`).

---

## Iconography

**System:** [Lucide](https://lucide.dev) — 24px grid, **1.75px** stroke, round caps/joins, `fill: none`, `stroke: currentColor`. This matches the existing component SVGs (Delta/StatCard arrows, Select chevron) which are hand-authored in the same Lucide idiom.

**Implementation:** a curated subset of Lucide path data is shipped inline in `ui_kits/pepite-dashboard/icons.jsx` as `<Icon name="…" size stroke color />`. Using the library's exact path data (Lucide is ISC-licensed) keeps stroke weight and metrics consistent without a runtime dependency. To extend, copy the path from lucide.dev and add it to the `PATHS` map.

> **Substitution flag:** Lucide is a *substitution* — no project icon set was provided. If the product standardizes on a different set (e.g. an in-house sprite or Phosphor/Heroicons), replace `icons.jsx` and update this section.

**Usage:** icons are monochrome, inherit `currentColor`, and are sized 12–18px in dense UI, up to 26px for empty-state/placeholder marks. Criterion icons are tinted with their `--viz-*` accent (euro/train/clock/leaf/building/volume). **No emoji, no unicode pictographs** as icons.

**Logo:** a faceted teal gem ("nugget") in `assets/logo-mark.svg` (64×64, rounded-square container) and `assets/logo-wordmark.svg`. The mark pairs with the "Pépite" wordmark set in Space Grotesk. The mark works on `--bg-base` and any dark surface.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (import list only). Consumers link this one file.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible entry for using Pépite in Claude Code.

**Tokens** (`tokens/`, all `@import`ed by `styles.css`)
- `fonts.css` — Google Fonts CDN (IBM Plex Sans/Mono, Space Grotesk).
- `colors.css` — surfaces, borders, text, brand, gold, semantic, `--viz-*`, score scale, heat gradient, aliases.
- `typography.css` — families, sizes (14px base), weights, leading, tracking.
- `spacing.css` — 4px spacing scale, radii, borders, elevation/glow, motion, z-index, layout dims.
- `base.css` — reset, body defaults, `.eyebrow`/`.mono`/`.tnum` utilities, scrollbars, focus, selection.

**Components** (`components/`) — React primitives, exported on `window.PPiteDesignSystem_0c887c`
- `forms/` — `Button` (primary/gold/secondary/ghost/danger), `IconButton`, `Input`, `Select`, `Switch`, `RangeSlider` (the scoring weight control).
- `data/` — `StatCard` (KPI), `ScoreGauge` (radial 0–100), `ScoreRadar` (multi-criteria spider), `ScoreBar`, `Badge`, `Delta`.
- `layout/` — `Card`, `Panel` (titled widget shell), `Tabs`.
- `status/` — `StatusDot` (with pulse), `LogRow` (mono log line).

**Foundation cards** (`guidelines/cards/`) — specimen tiles rendered in the Design System tab (Colors, Type, Spacing, Brand groups).

**UI kit** (`ui_kits/pepite-dashboard/`) — the full product, interactive
- `index.html` — click-through app (Dashboard → Fiche détail → Moteur de scoring → Monitoring).
- `AppShell.jsx` — sidebar + topbar chrome. `DashboardView.jsx` — KPIs + CSS heatmap cartography + pépites feed. `DetailView.jsx` — listing deep-dive with mathematical score justification, transports/isochrone, market comparison. `ConfigView.jsx` — real-time weight sliders, strict filters, alerts. `MonitoringView.jsx` — scraper sources, proxy pool, throughput, live log console.
- `icons.jsx` (Lucide subset), `data.js` (mock veille data).

**Assets** (`assets/`) — `logo-mark.svg`, `logo-wordmark.svg`.

**Recommended front-end stack** (from the brief): for a technical user wanting density + control, a **decoupled SPA (React or Vue) + FastAPI** back-end is the most flexible for this design — full control over the dense layout, custom data-viz, and real-time weight tuning. **Streamlit/Dash** are viable for a faster internal-only build but constrain the bespoke cartography and split-screen detail view. This design system is authored in React and maps directly onto the decoupled approach.
