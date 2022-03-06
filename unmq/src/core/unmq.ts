import { Exchange, Queue } from "..";

interface AbstractCollection<T> {
  [k: string]: T;
}
function createUnmq<E extends AbstractCollection<Exchange<unknown>>, Q extends AbstractCollection<Queue<unknown>>>(
  exchangeCollection: E,
  queueCollection: Q,
) {
  return <J extends keyof E>(d: J) => {
    return d;
  };
}

const app = createUnmq({
  ex1: new Exchange<number>({ name: "ex1" }),
});
app("1");


