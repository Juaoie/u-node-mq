import unmq from "./index.js";
/**
 * ex1.js模块
 *
 * 交换机有ex2
 *
 * 队列有qu1
 */

const body = document.getElementById("ex1");
//发送给qu1
const button1 = document.createElement("button");
button1.innerText = "发送消息给qu1，直接发送给队列";
button1.onclick = function () {
  console.log("ex1 发送了一条消息给 qu1");
  unmq.emitToQueue("qu1", "发给qu1");
};
body.appendChild(button1);

//发送给ex2 普通实例
const button2 = document.createElement("button");
button2.innerText = "发送消息给ex2交换机，在消费者上挂载固定载荷";
button2.onclick = function () {
  console.log("ex1 发送了一条消息给 ex2");
  unmq.emit("ex2", "发给ex2的消息1", "发给ex2的消息2");
};
body.appendChild(button2);

//发送给ex3，先发送后挂载消费者
const button3 = document.createElement("button");
button3.innerText = "发送消息给ex3交换机，先发送消息后挂载消费者";
button3.onclick = function () {
  console.log("ex1 发送了一条消息给 ex3");
  unmq.emit("ex3", "发送给ex3的消息");
};

body.appendChild(button3);

//发送给ex4，发送给只消费一条消息的消费者
const button4 = document.createElement("button");
button4.innerText = "发送消息给ex4交换机，发送给只消费一条消息的消费者";
button4.onclick = function () {
  console.log("ex1 发送了一条消息给 ex4");
  unmq.emit("ex4", "发送给ex4的消息");
};

body.appendChild(button4);

//发送给ex5，发送给只消费一次事件循环的消费者
const button5 = document.createElement("button");
button5.innerText = "发送消息给ex5交换机，发送给只消费一次事件循环的消费者";
button5.onclick = function () {
  console.log("ex1 发送了一条消息给 ex5");
  unmq.emit("ex5", "发送给ex5的消息");
};

body.appendChild(button5);

//发送给ex6，发送给有两个队列的消费者
const button6 = document.createElement("button");
button6.innerText = "发送消息给ex6交换机，发送给有两个队列的消费者";
button6.onclick = function () {
  console.log("ex1 发送了一条消息给 ex6");
  unmq.emit("ex6", "发送给ex6的消息");
};

body.appendChild(button6);

//发送给ex7，发送给需要消息确认的队列
const button7 = document.createElement("button");
button7.innerText = "发送消息给ex7交换机，发送给需要消息确认的队列";
button7.onclick = function () {
  console.log("ex1 发送了一条消息给 ex7");
  unmq.emit("ex7", "发送给ex7的消息");
};

body.appendChild(button7);

//发送给ex8，发送消息给中继器的交换机
const button8 = document.createElement("button");
button8.innerText = "发送消息给ex8交换机，发送消息给中继器的交换机";
button8.onclick = function () {
  console.log("ex1 发送了一条消息给 ex8");
  unmq.emit("ex8", "发送给ex8的消息");
};

body.appendChild(button8);
