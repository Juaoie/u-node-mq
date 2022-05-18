import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ, createQuickUnmq } from "../../src/index";
import { describe, expect, test } from "@jest/globals";
import { map } from "../../src/operators/map";

test("快速unmq，map测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>()
      //使用 operate
      .add(map((value) => value * 10)),
  });
  quickUnmq.on("qu1", (res: number) => {
    expect(res).toEqual(20);
    done();
  });
  quickUnmq.emit(2);
});
