Primary action button — use for the single most important action in a view (run scan, save weights, send alert). One `primary` per cluster; pair with `secondary`/`ghost` for the rest. `gold` flags a "pépite" / opportunity action.

```jsx
<Button variant="primary" size="md" onClick={runScan}>Lancer le scan</Button>
<Button variant="secondary">Annuler</Button>
<Button variant="gold" leftIcon={<Star/>}>Marquer pépite</Button>
```

Variants: `primary` (teal), `gold` (opportunity), `secondary` (neutral surface), `ghost` (toolbar), `danger`. Sizes `sm | md | lg`. `loading` swaps in a spinner and disables.
