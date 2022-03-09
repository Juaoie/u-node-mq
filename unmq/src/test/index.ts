import UNodeMQ, { Exchange, Queue, createUnmq } from "..";
import "../plugin/postMessage/index";

const unmq = new UNodeMQ(
  {
    ex1: new Exchange<string>(),
  },
  {
    qu1: new Queue(),
  },
  [],
);

unmq.emit("ex1", "消息");

const unmq1 = createUnmq(
  {
    ex1: new Exchange<string>(),
  },
  {
    qu1: new Queue(),
  },
  [],
);

unmq1.emit("ex1", "");
