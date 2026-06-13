Icon-only button for toolbars, map controls, table row actions. Always pass `label` (becomes tooltip + aria-label). Use `active` for toggled tools.

```jsx
<IconButton label="Zoom avant" variant="ghost"><Plus/></IconButton>
<IconButton label="Vue carte" active variant="brand"><Map/></IconButton>
```
