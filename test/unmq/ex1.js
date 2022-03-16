import unmq from "./index.js";
window.click1 = () => {
  unmq.emit("ex2", "发给ex2的消息");
};
unmq.on("qu1", (res) => {
  alert(res);
});
