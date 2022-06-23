import { Exchange, Queue, createQuickUnmq } from "../../src/index";
import filter from "../../src/operators/filter";

import { expect, test } from "@jest/globals";

test("快速unmq，filter测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>()
      //使用 operate
      .add(filter(res => res > 3)),
  });
  let n = "";
  quickUnmq.on("qu1", (res: number) => {
    n += res;
  });
  setTimeout(() => {
    expect(n).toEqual("456");
    done();
  }, 100);
  quickUnmq.emit(1, 2, 3, 4, 5, 6);
});
