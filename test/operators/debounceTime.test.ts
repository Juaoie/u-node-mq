import { Exchange, Queue, createQuickUnmq } from "../../src/index";
import debounceTime from "../../src/operators/debounceTime";
import { expect, test } from "@jest/globals";

test("快速unmq，debounceTime测试，立即执行", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1: new Queue<number>().add(debounceTime(1000, true)),
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

test("queue，debounceTime测试，立即执行", function (done) {
  const queue = new Queue<number>().add(debounceTime(400, true));
  let str = "";
  queue.pushConsume((res: number) => {
    str += res;
  });
  queue.pushContent(2);
  setTimeout(() => {
    queue.pushContent(3);
  }, 200);
  setTimeout(() => {
    queue.pushContent(4);
  }, 500);
  setTimeout(() => {
    queue.pushContent(5);
  }, 1000);
  setTimeout(() => {
    expect(str).toEqual("25");
    done();
  }, 1500);
});

test("queue，debounceTime测试，最后执行", function (done) {
  const queue = new Queue<number>().add(debounceTime(400));
  let str = "";
  queue.pushConsume((res: number) => {
    str += res;
  });
  queue.pushContent(2);
  setTimeout(() => {
    queue.pushContent(3);
  }, 200);
  setTimeout(() => {
    queue.pushContent(4);
  }, 500);
  setTimeout(() => {
    queue.pushContent(5);
  }, 1000);
  setTimeout(() => {
    expect(str).toEqual("45");
    done();
  }, 1500);
});
