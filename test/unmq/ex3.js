import unmq from "./index.js";

/**
 * ex3.js 模块
 *
 * 交换机有ex3
 *
 * 队列有qu3
 */

const body = document.getElementById("body");
const button = document.createElement("button");
button.innerText = "在qu3上挂载可移除的消费者";
let f = null;
button.onclick = () => {
  f = unmq.on("qu3", (res) => {
    alert(res);
  });
};
body.appendChild(button);

const button2 = document.createElement("button");
button2.innerText = "移除在qu3的消费者";
button2.onclick = () => {
  try {
    f();
  } catch (error) {}
};
body.appendChild(button2);
