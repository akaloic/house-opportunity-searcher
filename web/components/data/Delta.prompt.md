Inline +/- change with arrow. Use `invert` when lower is better (price vs market) so a negative reads green.

```jsx
<Delta value={-18} invert />   {/* 18% under market → green */}
<Delta value={4.2} />          {/* +4.2% → green */}
```
