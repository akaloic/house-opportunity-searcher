Section switcher within a view (Tous · Pépites · Favoris · Écartés). Supports per-tab `count` chips.

```jsx
<Tabs onChange={setTab} tabs={[
  {id:'all', label:'Toutes', count:248},
  {id:'gems', label:'Pépites', count:14, icon:<Star/>},
  {id:'saved', label:'Favoris', count:6},
]}/>
```
