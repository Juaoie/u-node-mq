import { Exchange, Queue, createQuickUnmq } from "../../src/index";
import of from "../../src/operators/of";

import { expect, test } from "@jest/globals";

test("快速unmq，of测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>(), {
    qu1: new Queue<number>()
      //使用 operate
      .add(of(1, 2, 3)),
  });
  let num = "";
  quickUnmq.on("qu1", (res: number) => {
    num += res;
  });
  setTimeout(() => {
    expect(num).toEqual("123");
    done();
  });
});
