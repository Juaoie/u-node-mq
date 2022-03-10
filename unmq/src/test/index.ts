import UNodeMQ, { Exchange, Queue, createUnmq } from "..";
import IframeMessage from "../plugin/message/index";

const unmq = new UNodeMQ(
  {
    ex1: new Exchange<string>(),
  },
  {
    qu1: new Queue(),
    qu2: new Queue(),
  },
);
const message = new IframeMessage()

unmq.emit("ex1",1)