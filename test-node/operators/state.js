const { Exchange, Queue, createQuickUnmq, state, of } = require("../u-node-mq");

module.exports = async () => {
  const quickUnmq = createQuickUnmq(new Exchange(), {
    qu1: new Queue().add(state(), of(1, 2, 3)),
    qu2: new Queue().add(state()),
  });
  const d = await quickUnmq.once("qu1");
  if (d !== 3) throw "断言失败" + d;

  const d1 = await quickUnmq.once("qu2");
  if (d1 !== null) throw "断言失败" + d1;

  console.log("state.js 执行成功");
};
