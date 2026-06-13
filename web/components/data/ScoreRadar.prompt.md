Multi-criteria radar chart for showing a decomposed Pépite score across its weighted axes — use it in the listing "deep dive" and anywhere a single number hides the shape of a deal.

```jsx
<ScoreRadar
  size={220}
  color="var(--brand-500)"
  axes={[
    { label: 'Prix / m² vs quartier', short: 'Prix/m²', value: 95 },
    { label: 'Proximité transports', short: 'Transports', value: 88 },
    { label: 'Fraîcheur', short: 'Fraîcheur', value: 90 },
    { label: 'Potentiel DPE', short: 'DPE', value: 72 },
    { label: 'Étage', short: 'Étage', value: 80 },
    { label: 'Calme', short: 'Calme', value: 70 },
  ]}
/>
```

Notes:
- 3–8 axes read cleanly; beyond that the polygon gets noisy.
- `color` defaults to brand teal — pass `var(--gold-500)` to flag a pépite, or a `--viz-*` token to overlay categories.
- Set `showLabels={false}` for a compact sparkline-style radar inside a table cell or card header.
