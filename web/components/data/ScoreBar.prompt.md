Decomposes a composite score into named criteria. Stack several to explain a score's "why". Color auto-follows value, or set `accent` to match a chart series.

```jsx
<ScoreBar label="Prix / m² vs quartier" value={92} suffix=" pts" />
<ScoreBar label="Proximité transports" value={78} accent="var(--viz-2)" />
<ScoreBar label="Potentiel DPE" value={40} accent="var(--viz-3)" />
```
