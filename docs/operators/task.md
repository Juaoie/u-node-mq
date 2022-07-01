<h2 id="task">🏆 task 设置队列能加入消息的数量 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange({ routes: ["qu1"] }), {
  qu1: new Queue().add(task(2)),
});
```
