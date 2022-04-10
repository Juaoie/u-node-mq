import unmq from "./index.js";

/**
 * ex4.js 模块
 *
 * 交换机有ex4
 *
 * 队列有qu4
 */

const body = document.getElementById("body");
const button = document.createElement("button");
button.innerText = "在qu4上挂载只消费一条消息的消费者";
button.onclick = () => {
  unmq.once("qu4", (res) => {
    alert(res);
  });
};
body.appendChild(button);
