const { Exchange, Queue, createQuickUnmq, interval, throttleTime } = require("../u-node-mq");

module.exports = () => {
  const quickUnmq = createQuickUnmq(new Exchange(), {
    qu1: new Queue().add(interval(100)),
  });
  const qu2 = new Queue().add(throttleTime(200, true));
  //将qu1的内容发射到qu2上，并在qu2上做其他业务操作
  quickUnmq.on("qu1", (res) => {
    qu2.pushContent(res);
  });

  let num2 = "";
  qu2.pushConsume((res) => {
    num2 += res;
  });
  setTimeout(() => {
    if (num2 !== "13579") throw "断言失败" + num2;
    quickUnmq.off("qu1");
    console.log("interval.js 执行成功");
  }, 1050);
};
