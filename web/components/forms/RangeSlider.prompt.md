The scoring engine's core control. One per criterion (métro, prix/m², DPE, étage…). Color each with `accent` so weights are scannable. Live value pill updates in real time so the user can feel the re-weighting.

```jsx
<RangeSlider label="Proximité métro" defaultValue={80} valueSuffix="%" accent="var(--viz-2)" />
<RangeSlider label="Potentiel DPE" defaultValue={45} valueSuffix="%" accent="var(--viz-3)" />
```
