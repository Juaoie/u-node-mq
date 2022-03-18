import unmq from "./index.js";

/**
 * ex5.js 模块
 *
 * 交换机有ex5
 *
 * 队列有qu5
 */

const body = document.getElementById("body");
const button = document.createElement("button");
button.innerText = "在qu5上挂载只消费一次事件循环的消费者";
button.onclick = () => {
  unmq.on("qu5", (res) => {
    alert(res);
  })();
};
body.appendChild(button);
