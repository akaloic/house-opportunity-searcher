Wraps a dashboard widget with a titled header bar. Use `noPadding` for maps, tables and log consoles that bleed to the edge; put filters/buttons in `actions`.

```jsx
<Panel title="Carte des opportunités" icon={<Map/>} actions={<Select>…</Select>} noPadding>
  <MapView/>
</Panel>
```
