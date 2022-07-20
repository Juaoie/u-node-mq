## interval

在项目中过度使用 setInterval 可能导致一些死循环或者没有 clearInterval 的问题

建议在项目中使用 unmq 全局设置一个 interval，再使用 throttleTime 去为每个需要定时循环的的地方做定时数据分发

将 interval 第二个参数设置为 true，可以在没有消费者的时候停止循环

```javascript
import UNodeMQ, { Exchange, Queue, ConsumMode, createQuickUnmq } from "u-node-mq";
import interval from "u-node-mq/operators/interval"

  const quickUnmq = createQuickUnmq(new Exchange<number>(), {
    qu1: new Queue<number>()
      //使用 operate
      .add(interval(1000, false)),
  });
```
