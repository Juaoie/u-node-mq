<h2 id="throttleTime">🎾 throttleTime 节流功能 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange({ routes: ["qu1"] }), {
  qu1: new Queue().add(throttleTime(1000, true)),
});
```
