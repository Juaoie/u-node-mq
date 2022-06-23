import UNodeMQ, { Exchange, Queue } from "../u-node-mq/index";
import { expect, test, jest } from "@jest/globals";

test("先挂载消费者，再发送消息", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    },
  );
  const f1 = jest.fn(() => true);
  unmq.on("qu1", f1);
  unmq.emit("ex1", "test");

  setTimeout(() => {
    //f1被调用一次
    expect(f1.mock.calls.length).toBe(1);

    // 第一次调用函数时的第一个参数是 test
    expect(f1.mock.calls[0][0]).toBe("test");
    done();
  });
});
