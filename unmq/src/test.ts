import { Exchange, Queue } from ".";
import UNodeMQ from "./core/UNodeMQ";

const unmq = new UNodeMQ(
  {
    ex1: new Exchange<number>({}),
    ex2: new Exchange<number>({}),
    1: new Exchange<string>({}),
    [Symbol()]: new Exchange<string>({}),
  },
  {
    que1: new Queue<string>({}),
  },
);

unmq.emit("ex1", "2");
unmq.emit("1", "1");
unmq.emitToQueue("que1", "22");

const o = {
  a: 1,
  b: 2,
};
type O = typeof o;

type A<K extends keyof O> = { k: K };

const a: A<"a"> = {
  k: "a",
};

type Flatten<T> = T extends Array<infer U> ? U : never;

type T0 = ["12", "32"];
type T1 = Flatten<T0>; // string | number
