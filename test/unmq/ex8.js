import unmq from "./index.js";

/**
 * ex8.js 模块
 *
 * 交换机有ex8
 *
 * 队列有qu8
 *
 * 演示中继器
 */

unmq.on("qu8", (res) => {
  alert(res);
});
