import unmq from "./index.js";
window.click2 = () => {
  unmq.emit("ex1", "发给ex1的消息");
};
// unmq.on("qu2", (res) => {
//   alert(res);
// });

setTimeout(() => {
  unmq.once("qu2", (res) => {
    console.log(res);
  });
  // unmq.on("qu2", (res) => {
  //   alert(res);
  // })();
}, 3000);
