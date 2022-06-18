import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ, createQuickUnmq, state, of } from "../../src/index";
import { describe, expect, test } from "@jest/globals";

test("快速unmq，state测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>(), {
    qu1: new Queue<number>().add(state(), of(1, 2, 3)),
  });
  setTimeout(async () => {
    const d = await quickUnmq.once("qu1");
    expect(d).toEqual(3);
    done();
  }, 100);
});
