<h2 id="map">🌞 map 对队列消息进行映射 </h2>

```javascript
import UNodeMQ, { Exchange, Queue, ConsumMode, createQuickUnmq, map } from "u-node-mq";

const quickUnmq = createQuickUnmq(new Exchange({ routes: ["qu1"] }), {
  qu1: new Queue().add(map((value, index) => value * 10)),
});
```
