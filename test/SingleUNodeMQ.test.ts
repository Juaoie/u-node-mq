import { Queue, SingleUNodeMQ, Logs, createSingleUnmq } from "../src/index";
import { expect, test, describe } from "@jest/globals";
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

  test("SingleUNodeMQ.emit", function (done) {
    type T = number;
    const singleUnmq = new SingleUNodeMQ(new Queue<T>());

    singleUnmq.emit(1);
    singleUnmq.emit(2, 3, 4, 5);

    const listEqual = createListEqual();
    singleUnmq.on((res: T) => listEqual.list.push(res));
    listEqual.equal([1, 2, 3, 4, 5], 0, done);
  });
  test("SingleUNodeMQ.on", function (done) {
    expect.assertions(10);

    type T = number;
    const singleUnmq1 = new SingleUNodeMQ<T>(new Queue());

    singleUnmq1.emit(1, 2, 3, 4, 5);

    singleUnmq1.on((res: T, payload: any) => {
      expect([1, 2, 3, 4, 5].indexOf(res) !== -1).toBe(true);
      expect(payload).toEqual("payload");
    }, "payload");

    setTimeout(done);
  });
  test("SingleUNodeMQ.once", async function () {
    expect.assertions(5);

    type T = number;
    const singleUnmq1 = new SingleUNodeMQ(new Queue<T>());

    singleUnmq1.emit(1, 2, 3);

    const res1 = await singleUnmq1.once();
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
        singleUnmq1.once((res2: T) => {
          res(res2);
        });
      }),
      new Promise(res => {
        singleUnmq1.once((res2: T, payload) => {
          res({ res2, payload });
        }, "payload");
      }),
    ]);

    expect(res2_1).toEqual(2);
    expect(res2_2.res2).toEqual(2);
    expect(res2_2.payload).toEqual("payload");

    const res3 = await new Promise(res => {
      singleUnmq1.once((res3: T) => {
        res(res3);
      });
    });

    expect(res3).toEqual(3);

    //
  });

  test("SingleUNodeMQ.off", async function () {
    expect.assertions(2);

    type T = number;
    const singleUnmq1 = new SingleUNodeMQ(new Queue<T>({ async: false }));
    const singleUnmq2 = new SingleUNodeMQ(new Queue<T>({ async: true }));

    singleUnmq1.emit(1, 2);
    const res = await new Promise(res => {
      singleUnmq1.on((data: T) => {
        res(data);
        singleUnmq1.off();
      });
    });
    expect(res).toEqual(1);

    singleUnmq2.emit(3, 4, 5);
    await promiseSetTimeout(0);
    const res_a = await new Promise(res => {
      const a: any[] = [];
      singleUnmq2.on((data: T) => {
        a.push(data);
      })();
      setTimeout(() => {
        res(a);
      });
    });
    expect(res_a).toEqual([3, 4, 5]);
  });
});

describe("createSingleUnmq", () => {
  //
  test("createSingleUnmq_init", function () {
    //

    expect(createSingleUnmq() instanceof SingleUNodeMQ).toBeTruthy();
    expect(createSingleUnmq({}) instanceof SingleUNodeMQ).toBeTruthy();
    expect(createSingleUnmq(new SingleUNodeMQ()) instanceof SingleUNodeMQ).toBeTruthy();
  });

  /**
   * 测试一个消息返回promise false重复消费
   */

  test("createSingleUnmq_reset", function () {
    const t = createSingleUnmq({ ask: true, rcn: 10 });
    let i = 0;
    t.on(async () => {
      await promiseSetTimeout(100);
      i++;
      return false;
    });
    setTimeout(() => {
      expect(i).toEqual(10);
    }, 1200);
  });
});
