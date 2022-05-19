import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ, createQuickUnmq, task } from "../../src/index";
import { describe, expect, test } from "@jest/globals";

test("快速unmq，task测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>()
      //使用 operate
      .add(task(2)),
  });
  let num = "";
  quickUnmq.on("qu1", (res: number) => {
    num += res;
  });
  quickUnmq.emit(1, 2, 3, 4);
  setTimeout(() => {
    expect(num).toEqual("12");
    done();
  });
});
