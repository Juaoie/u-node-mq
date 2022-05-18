import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ, createQuickUnmq, debounceTime } from "../../src/index";
import { describe, expect, test } from "@jest/globals";

test("快速unmq，debounceTime测试", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>().add(debounceTime(1000)),
  });
  let str = "";
  quickUnmq.on("qu1", (res: number) => {
    str += res;
  });
  quickUnmq.emit(2, 3, 4);
  setTimeout(() => {
    quickUnmq.emit(5);
  }, 1200);
  setTimeout(() => {
    expect(str).toEqual("25");
    done();
  }, 1500);
});

test("queue，debounceTime测试", function (done) {
  const queue = new Queue<number>().add(debounceTime(1000));
  let str = "";
  queue.pushConsume((res: number) => {
    str += res;
  });
  queue.pushContent(2);
  queue.pushContent(3);
  queue.pushContent(4);
  setTimeout(() => {
    queue.pushContent(5);
  }, 1200);
  setTimeout(() => {
    expect(str).toEqual("25");
    done();
  }, 1500);
});
