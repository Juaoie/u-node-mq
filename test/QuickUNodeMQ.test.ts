import { Exchange, Queue, QuickUNodeMQ, Logs } from "../src/index";
import { expect, test, describe, jest } from "@jest/globals";
import { promiseSetTimeout } from "../src/utils/tools";
Logs.setLogsConfig({ logs: false });
describe("QuickUNodeMQ", () => {
  /**
   * 创建测试list的方法
   * @returns
   */
  function createListEqual<T>() {
    const list: T[] = [];
    return {
      list,
      equal(list: T[], time = 0, callback?: () => void) {
        setTimeout(() => {
          expect(this.list).toEqual(list);
          if (callback) callback();
        }, time);
      },
      equalDisorder() {
        //TODO:
      },
    };
  }

  test("QuickUNodeMQ.emit", function (done) {
    type T = number;
    const quickUnmq = new QuickUNodeMQ(new Exchange<T>({ routes: ["qu1"] }), { qu1: new Queue<T>() });

    quickUnmq.emit(1);
    quickUnmq.emit(2, 3, 4, 5);

    const listEqual = createListEqual();
    quickUnmq.on("qu1", (res: T) => listEqual.list.push(res));
    listEqual.equal([1, 2, 3, 4, 5], 0, done);
  });
  test("QuickUNodeMQ.emitToQueue", function (done) {
    type T = number;
    const queColl = { qu1: new Queue<T>() };
    const quickUnmq = new QuickUNodeMQ<T, typeof queColl>({ routes: ["qu1"] }, queColl);

    quickUnmq.emitToQueue("qu1", 1);
    quickUnmq.emitToQueue("qu1", 2, 3, 4, 5);

    const listEqual = createListEqual();
    quickUnmq.on("qu1", (res: T) => listEqual.list.push(res));
    listEqual.equal([1, 2, 3, 4, 5], 0, done);

    setTimeout(done);
  });
  test("QuickUNodeMQ.on", function (done) {
    expect.assertions(10);

    type T = number;
    const quickUnmq1 = new QuickUNodeMQ(new Exchange<T>({ routes: ["qu1"] }), { qu1: new Queue<T>() });

    quickUnmq1.emit(1, 2, 3, 4, 5);

    quickUnmq1.on(
      "qu1",
      (res: T, payload: any) => {
        expect([1, 2, 3, 4, 5].indexOf(res) !== -1).toBe(true);
        expect(payload).toEqual("payload");
      },
      "payload",
    );

    setTimeout(done);
  });
  test("QuickUNodeMQ.once", async function () {
    expect.assertions(4);

    type T = number;
    const quickUnmq1 = new QuickUNodeMQ(new Exchange<T>({ routes: ["qu1"] }), { qu1: new Queue<T>() });

    quickUnmq1.emit(1, 2, 3);

    const res1 = await quickUnmq1.once("qu1");
    expect(res1).toBe(1);

    quickUnmq1.once("qu1", (res2: T) => {
      console.log("🚀 ~ file: QuickUNodeMQ.test.ts ~ line 82 ~ quickUnmq1.once ~ res2", res2);
      expect(res2).toBe(2);
    });

    quickUnmq1.once(
      "qu1",
      (res3: T, payload: any) => {
        console.log("🚀 ~ file: QuickUNodeMQ.test.ts ~ line 88 ~ res3", res3);
        expect(res3).toBe(3);
        expect(payload).toBe("payload");
      },
      "payload",
    );

    await promiseSetTimeout(1000);
    // return;
  });
});
