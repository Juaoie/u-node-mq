import { Exchange } from ".";
import UNodeMQ from "./core/UNodeMQ";

const unmq = new UNodeMQ({
  exchange: {
    ex: new Exchange({ name: "ex" }),
  },
  queue: {},
});

// function getUser() {
//   return {name: 'xxx', age: 10}
// }

// type GetUserType = typeof getUser;
// type ReturnUser = ReturnType<GetUserType>

function getUser({ a }) {
  return { name: "xxx", age: 10 };
  type GetUserType = typeof getUser;
  type ReturnUser = Parameters<GetUserType>;
}

interface Data extends Record<string, number> {
  a: number;
  b: number;
}
interface DT {
  [k: string]: boolean;
}
class A {
  constructor(private data: Data) {}
  getData() {
    return this.data;
  }
  create<D>(data: D) {
    type K = keyof typeof data;
    return <J extends K>(d: J) => {
      return d
    };
  }
  test() {

    const app = this.create({ a: false });
    app("c");
  }
}
