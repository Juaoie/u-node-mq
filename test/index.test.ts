import UNodeMQ, { Exchange, Queue, ConsumMode, QuickUNodeMQ } from "../src/index";
import { describe, expect, test } from "@jest/globals";

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
  setTimeout(() => {
    unmq.on("qu1", (res) => {
      expect(res).toBe("test");
      done();
    });
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
  let num = 0;
  unmq.emit("ex1", "test");
  unmq.on("qu1", (res) => {
    num++;
  });
  unmq.on("qu1", () => {
    num++;
  });
  setTimeout(() => {
    expect(num).toEqual(2);
    done();
  });
});

test("routes分发到多个队列", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1", "qu2"] }),
    },
    {
      qu1: new Queue({ mode: ConsumMode.All }),
      qu2: new Queue({ mode: ConsumMode.All }),
    }
  );
  unmq.emit("ex1", "test");
  let num = 0;
  unmq.on("qu1", () => {
    num++;
  });
  unmq.on("qu2", () => {
    num++;
  });
  setTimeout(() => {
    expect(num).toEqual(2);
    done();
  });
});

test("检查名称是否自动填充", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange(),
    },
    {
      qu1: new Queue(),
    }
  );
  expect(unmq.getExchange("ex1")?.name).toEqual("ex1");
  expect(unmq.getQueue("qu1")?.name).toBe("qu1");
  done();
});

test("有且仅消费一条消息，emit异步，off同步", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  let num = 0;
  unmq.on("qu1", () => {
    num++;
  })();
  unmq.emit("ex1", 1, 2, 3);
  unmq.on("qu1", () => {
    num++;
  })();
  setTimeout(() => {
    unmq.on("qu1", () => {
      num++;
    })();
    expect(num).toEqual(1);
    done();
  });
});

test("有且仅消费一条消息", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  let num = 0;
  unmq.once("qu1", () => {
    num++;
  });
  unmq.emit("ex1", 1, 2, 3);
  setTimeout(() => {
    expect(num).toEqual(1);
    expect(unmq.getQueue("qu1")?.getNews().length).toEqual(2);
    done();
  });
});

test("移除方法", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  let num = 0;
  unmq.emit("ex1", 1, 2, 3);
  function fun() {
    num++;
  }
  unmq.on("qu1", fun);
  unmq.off("qu1", fun);
  setTimeout(() => {
    expect(num).toEqual(0);
    done();
  });
});

test("直接发送消息给队列的方法", function (done) {
  const unmq = new UNodeMQ(
    {},
    {
      qu1: new Queue(),
    }
  );
  let num = 0;
  unmq.emitToQueue("qu1", 1, 2, 3);
  unmq.on("qu1", () => {
    num++;
  });
  setTimeout(() => {
    expect(num).toEqual(3);
    done();
  }, 1000);
});

test("观察者模式", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ ask: true, mode: ConsumMode.All }),
    }
  );
  let num = 0;
  unmq.on("qu1", () => true);
  unmq.emit("ex1", 1, 2, 3);
  unmq.on("qu1", () => {
    num++;
    return true;
  });
  setTimeout(() => {
    unmq.on("qu1", () => {
      num++;
    });
    expect(num).toEqual(3);
    done();
  });
});

test("测试中继器返回不存在的队列名称", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu2", "qu1"] }),
    },
    {
      qu1: new Queue({ ask: true, mode: ConsumMode.All }),
    }
  );
  let num = 0;
  unmq.emit("ex1", 1, 2, 3);
  unmq.on("qu1", () => {
    num++;
    return true;
  });
  setTimeout(() => {
    expect(num).toEqual(3);
    done();
  });
});

test("快速unmq", function (done) {
  interface T {
    test: number;
  }
  const quickUnmq = new QuickUNodeMQ(new Exchange<T>({ routes: ["qu1"] }), {
    qu1: new Queue(),
  });
  quickUnmq.on("qu1", (res: T) => {
    expect(res).toEqual({ test: 1 });
    done();
  });
  quickUnmq.emit({ test: 1 });
});

test("promise确认消费成功", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ ask: true }),
    }
  );
  unmq.on("qu1", (res: string) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 500);
    });
  });
  setTimeout(() => {
    expect(unmq.getQueue("qu1")!.getNews()).toHaveLength(1);
    done();
  }, 700);
  unmq.emit("ex1", 1, 2, 3);
});

test("promise确认消费失败", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ ask: true }),
    }
  );
  let num = 0;
  unmq.on("qu1", (data: number) => {
    return new Promise((res) => {
      setTimeout(() => {
        num++;
        if (data === 1) res(true);
        else res(false);
      }, 500);
    });
  });

  setTimeout(() => {
    //检查1是否被消费
    const news = unmq.getQueue("qu1")!.getNews();
    expect(news).toHaveLength(1);
    //3应该被取出正在消费，2应该消费失败一次
    expect(news[0].consumedTimes).toBe(2);
    expect(news[0].content).toBe(2);
    expect(num).toBe(2);
    done();
  }, 1200);
  unmq.emit("ex1", 1, 2, 3);
});

test("异步队列消费", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ ask: true, async: true }),
    }
  );
  let num = 0;
  unmq.on("qu1", (data: number) => {
    return new Promise((res) => {
      setTimeout(() => {
        num++;
        if (data === 1) res(true);
        else res(false);
      }, 500);
    });
  });

  setTimeout(() => {
    //检查1是否被消费
    const news = unmq.getQueue("qu1")!.getNews();
    expect(news).toHaveLength(0);
    expect(num).toBe(5);
    done();
  }, 1200);
  unmq.emit("ex1", 1, 2, 3);
});

test("消费一条消息是否会影响别的消息", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ ask: true }),
    }
  );
  unmq.once("qu1", (res: string) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 500);
    });
  });
  setTimeout(() => {
    const news = unmq.getQueue("qu1")!.getNews();
    expect(news).toHaveLength(2);
    news.forEach((item) => {
      expect(item.consumedTimes).toBe(3);
    });
    done();
  }, 1000);
  unmq.emit("ex1", 1, 2, 3);
});

test("检测是否出现增量循环消费的问题", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue({ ask: true, rcn: 4, mode: ConsumMode.All }),
    }
  );
  let num = 0;
  unmq.on("qu1", (res: string) => {
    num++;
    return false;
  });
  unmq.on("qu1", (res: string) => {
    num++;
    return false;
  });
  setTimeout(() => {
    const news = unmq.getQueue("qu1")!.getNews();
    expect(num).toBe(8);
    expect(news).toHaveLength(0);
    done();
  }, 1000);
  unmq.emit("ex1", "test");
});
