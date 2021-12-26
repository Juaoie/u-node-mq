import UNodeMQ from "../dist/UNodeMQ";

const unmq = new UNodeMQ<string>({ exchangeName: "exch", queueNameList: ["123"] });
unmq.exchange.routes = ["123"];
unmq.emit("消息内容1", "消息2");
unmq.once("123", (value) => {
  console.log(value);
});
unmq.once("123", (value) => {
  console.log(value);
});
