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
    expect.assertions(5);

    type T = number;
    const quickUnmq1 = new QuickUNodeMQ(new Exchange<T>({ routes: ["qu1"] }), { qu1: new Queue<T>() });

    quickUnmq1.emit(1, 2, 3);

    const res1 = await quickUnmq1.once("qu1");
    expect(res1).toEqual(1);
    /**
      
     
     当队列设置为同步消费的时候

     由于消费者在消费一条消息以后，队列并不会立马收到回调，所以会在下次事件循环将队列的消费方法放开，所以会积累一次事件循环的消费者进入队列

     因此下次两次once方法实际上是订阅的同一条消息


     */

    /**
    

      jest内部使用try catch捕获不到异步情况下的断言错误，所以异步代码即使断言错误报错了，只会阻塞下面的代码执行，不会被jest捕获到

      因此这里需要将下面的once方法手动封装成promise方法


~~~typescript

  quickUnmq1
      .once("qu1", (res2: T) => {
        expect(res2).toEqual(2);
        quickUnmq1.once("qu1", (res3: T) => {
          expect(res3).toEqual(4);
          done();
        });
      })
      .once(
        "qu1",
        (res2: T, payload: any) => {
          expect(res2).toEqual(2);
          expect(payload).toEqual("payload");
        },
        "payload",
      );
~~~
      
      */

    const [res2_1, res2_2] = await Promise.all<any>([
      new Promise(res => {
        quickUnmq1.once("qu1", (res2: T) => {
          res(res2);
        });
      }),
      new Promise(res => {
        quickUnmq1.once(
          "qu1",
          (res2: T, payload) => {
            res({ res2, payload });
          },
          "payload",
        );
      }),
    ]);

    expect(res2_1).toEqual(2);
    expect(res2_2.res2).toEqual(2);
    expect(res2_2.payload).toEqual("payload");

    const res3 = await new Promise(res => {
      quickUnmq1.once("qu1", (res3: T) => {
        res(res3);
      });
    });

    expect(res3).toEqual(3);

    //
  });
});
