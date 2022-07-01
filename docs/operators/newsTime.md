<h2 id="newsTime">🚲 newsTime 设置消息最长存活时长 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange({ routes: ["qu1"] }), {
  qu1: new Queue().add(newsTime(3000)),
});
```
