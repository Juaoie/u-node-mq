<h2 id="debounceTime">🚴 debounceTime 防抖功能 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange({ routes: ["qu1"] }), {
  qu1: new Queue().add(debounceTime(1000, true)),
});
```
