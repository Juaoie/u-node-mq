import { Exchange, Queue } from ".";
import UNodeMQ from "./core/UNodeMQ";

const unmq = new UNodeMQ(
  {
    ex1: new Exchange<string>({}),
    ex2: new Exchange<number>({}),
    1: new Exchange<number>({}),
    [Symbol()]: new Exchange<number>({}),
  },
  {
    que1: new Queue<string>({}),
  },
);

unmq.emit("ex1", 2);
unmq.emit(1, 2);
unmq.emitToQueue("que1", 2);

type Record<T> = {
  [P: string]: T;
};
class Test<T extends Record<any>> {
  constructor(t: T) {
    let a: T = { aaa: 1 };
  }
}

new Test({
  1: 1,
});
