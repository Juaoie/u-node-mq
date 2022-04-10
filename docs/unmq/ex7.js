import unmq from "./index.js";

/**
 * ex7.js 模块
 *
 * 交换机有ex7
 *
 * 队列有qu7
 *
 * 修改ask 和 rcn字段展示效果
 */

unmq.on("qu7", (res, ask) => {
  alert(res);
  ask();
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     ask()
  //   }, 3000);
  // });
});
