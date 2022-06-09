import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ, createQuickUnmq, removeDuplicates } from "../../src/index";
import { describe, expect, test } from "@jest/globals";

test("快速unmq，removeDuplicates测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>()
      //使用 operate
      .add(removeDuplicates((res) => res)),
  });
  let n = "";
  quickUnmq.on("qu1", (res: number) => {
    n += res;
  });
  setTimeout(() => {
    expect(n).toEqual("1234");
    done();
  }, 100);
  quickUnmq.emit(1, 2, 3, 3, 4, 4, 4, 4, 4, 4, 1);
});
