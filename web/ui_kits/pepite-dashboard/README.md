# Pépite Dashboard — UI Kit

Interactive, click-through recreation of the **Pépite veille immobilière** app (Paris / Île-de-France property watch). Built entirely from the Pépite component primitives.

Open `index.html`. Navigate via the sidebar; click a pépite (map pin or feed row) and "Ouvrir la fiche" to deep-dive.

## Views
- **Dashboard** (`DashboardView.jsx`) — KPI strip, a CSS-drawn opportunity **cartography** (street grid, Seine, parks, score-weighted heatmap, clickable score pins) and a live **flux de pépites** feed ranked by score.
- **Fiche détail** (`DetailView.jsx`) — listing "deep dive": photo/street-view split, key facts, transports + 15-min isochrone, market comparison (annonce vs médiane quartier), and the **mathematical score justification** (radar + per-criterion weighted contributions).
- **Moteur de scoring** (`ConfigView.jsx`) — the core: **real-time weight sliders** (the preview re-ranks instantly), strict filters (price, surface, zones, DPE), and alert config.
- **Monitoring** (`MonitoringView.jsx`) — scraper source health table, proxy pool, throughput chart, system health, and a live log console.

## Files
- `index.html` — app shell + nav state wiring.
- `AppShell.jsx` — sidebar + topbar.
- `*View.jsx` — the four views (each registers itself on `window`).
- `icons.jsx` — Lucide icon subset (`<Icon name size stroke color />`).
- `data.js` — mock listings, scoring weights, sources, logs (`window.PEPITE_DATA`).

## Notes
- Components come from `window.PPiteDesignSystem_0c887c` via the compiled `_ds_bundle.js`.
- Designed at **1440×900**; it's a dense desktop tool — narrow viewports will wrap and scroll.
- All data is fictional. Map and photos are functional placeholders (the real product fills them from listing sources and a map provider).
