// const UNodeMQ = require("../index.node.min.js");
// const Exchange = require("../index.node.min.js");
import UNodeMQ, { Exchange, Queue, ConsumMode } from "../src/index";

test("先挂载消费者，再发送消息", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  unmq.on("qu1", (res) => {
    expect(res).toBe("test");
    done();
  });
  unmq.emit("ex1", "test");
});

test("先发送消息，再挂载消费者", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  unmq.emit("ex1", "test");
  unmq.on("qu1", (res) => {
    expect(res).toBe("test");
    done();
  });
});

test("随机消费", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  unmq.emit("ex1", "test");
  unmq.on("qu1", () => done());
  unmq.on("qu1", () => done());
});

test("全部消费", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ mode: ConsumMode.All }),
    }
  );
  unmq.emit("ex1", "test");
  let num = 0;
  unmq.on("qu1", () => {
    num++;
  });
  unmq.on("qu1", () => {
    num++;
  });
  if (num === 2) done();
});


test("routes分发到多个队列", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes:["qu1","qu2"] }),
    },
    {
      qu1: new Queue({ mode: ConsumMode.All }),
      // qu1: new Queue({ mode: ConsumMode.All }),
    }
  );
  unmq.emit("ex1", "test");
  let num = 0;
  unmq.on("qu1", () => {
    num++;
  });
  unmq.on("qu1", () => {
    num++;
  });
  if (num === 2) done();
});
