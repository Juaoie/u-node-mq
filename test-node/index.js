const { Exchange, Queue, createQuickUnmq, interval, throttleTime } = require("./u-node-mq");
const UNodeMQ = require("./u-node-mq").default;
/**
 * 使用node直接运行进行测试
 * 可以更加方便快速的进行调试
 */
const unmq = new UNodeMQ(
  {
    ex1: new Exchange({ routes: ["qu1"] }),
  },
  {
    qu1: new Queue(),
  }
);
const t1 = new Date().getTime();
unmq.emit("ex1", "test");
unmq.on("qu1", () => {
  const t2 = new Date().getTime();

  console.log("消费时长ms：", t2 - t1);
});

require("./operators/interval")();
