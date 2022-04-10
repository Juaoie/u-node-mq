import unmq from "./index.js";

/**
 * ex6.js 模块
 *
 * 交换机有ex6
 *
 * 队列有qu6
 *
 * 修改队列类型 Random All 展示随机消费或者全部消费
 */

unmq.on("qu6", (res) => {
  alert("消费者1：" + res);
});

unmq.on("qu6", (res) => {
  alert("消费者2：" + res);
});
