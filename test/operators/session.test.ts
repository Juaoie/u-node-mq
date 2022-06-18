import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ, createQuickUnmq, session, state, of } from "../../src/index";
import { describe, expect, test } from "@jest/globals";

test("快速unmq，session组合测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>().add(session()).add(state()),
  });
  quickUnmq.emit(1, 2, 3);
  setTimeout(async () => {
    const d = await quickUnmq.once("qu1");
    expect(d).toEqual(3);
    sessionStorage.setItem("qu2", "123");
    expect(sessionStorage.getItem("qu2")).toEqual("123");

    expect(sessionStorage.getItem("qu1")).toEqual("3");
    done();
  }, 100);
});
