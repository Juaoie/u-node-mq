import { Exchange, Queue } from ".";
import UNodeMQ from "./core/UNodeMQ";

const unmq = new UNodeMQ(
  {
    1: new Exchange({}),
  },
  {
    que1: new Queue({}),
  },
);

unmq.emit(1, 1);
unmq.emitToQueue("que2", 2);

const o = {
  a: 1,
  b: 2,
};
type O = typeof o;

type A<K extends keyof O> = { k: K };

const a: A<"a"> = {
  k:"a"
};
