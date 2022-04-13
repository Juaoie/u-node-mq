import UNodeMQ, { Exchange, Queue } from "../../index.neutral.min.js";
const unmq = new UNodeMQ(
  {
    ex1: new Exchange(),
    ex2: new Exchange({ routes: ["qu2"] }),
    ex3: new Exchange({ routes: ["qu3"] }),
    ex4: new Exchange({ routes: ["qu4"] }),
    ex5: new Exchange({ routes: ["qu5"] }),
    ex6: new Exchange({ routes: ["qu6"] }),
    ex7: new Exchange({ routes: ["qu7"] }),
    ex8: new Exchange({
      repeater: (content) => ["qu8"],
    }),
  },
  {
    qu1: new Queue(),
    qu2: new Queue(),
    qu3: new Queue(),
    qu4: new Queue(),
    qu5: new Queue(),
    qu6: new Queue({ mode: "All" }),
    qu7: new Queue({ ask: true, rcn: 3 }),
    qu8: new Queue(),
  }
);
export default unmq;
window.unmq = unmq;
