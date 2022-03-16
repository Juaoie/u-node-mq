import UNodeMQ, { Exchange, Queue } from "/dist/index.js";
const unmq = new UNodeMQ(
  { ex1: new Exchange({ routes: ["qu1"] }), ex2: new Exchange({ routes: ["qu2"] }) },
  { qu1: new Queue(), qu2: new Queue() }
);
export default unmq;
console.log("🚀 ~ file: index.html ~ line 14 ~ unmq", unmq);
