import { Exchange, Queue, createQuickUnmq } from "../../src/index";
import interval from "../../src/operators/interval";
import throttleTime from "../../src/operators/throttleTime";

import { expect, test } from "@jest/globals";

test("interval测试，一直循环", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>(), {
    qu1: new Queue<number>()
      //使用 operate
      .add(interval(1000, false)),
  });

  let num = "";
  quickUnmq.on("qu1", (res: number) => {
    num += res;
  });

  const qu2 = new Queue<number>().add(interval(1000, false));

  let num2 = "";
  qu2.pushConsume((res: number) => {
    num2 += res;
  });
  setTimeout(() => qu2.removeAllConsumer(), 2500);
  setTimeout(() => {
    expect(num).toEqual("1234");
    expect(num2).toEqual("12");
    expect(qu2.getNews().length).toEqual(2);
    done();
  }, 4500);
});

test("interval测试，优化版", function (done) {
  const qu2 = new Queue<number>().add(interval(100));

  let num2 = "";
  qu2.pushConsume((res: number) => {
    num2 += res;
  });
  setTimeout(() => qu2.removeAllConsumer(), 250);

  setTimeout(() => {
    qu2.pushConsume((res: number) => {
      num2 += res;
    });
  }, 750);
  setTimeout(() => {
    expect(num2).toEqual("1234");
    expect(qu2.getNews().length).toEqual(0);
    done();
  }, 1050);
});

test("interval测试，简单组合使用技巧", function (done) {
  const qu1 = new Queue<number>().add(interval(100)).add(throttleTime(200, true));

  let num2 = "";
  qu1.pushConsume((res: number) => {
    num2 += res;
  });
  setTimeout(() => {
    expect(num2).toEqual("13579");
    expect(qu1.getNews().length).toEqual(0);
    done();
  }, 1050);
});

test("interval测试，组合使用技巧", function (done) {
  const qu1 = new Queue<number>().add(interval(100));
  const qu2 = new Queue<number>().add(throttleTime(200, true));
  //将qu1的内容发射到qu2上，并在qu2上做其他业务操作
  qu1.pushConsume(qu2.pushContent.bind(qu2));

  let num2 = "";
  qu2.pushConsume((res: number) => {
    num2 += res;
  });
  setTimeout(() => {
    expect(num2).toEqual("13579");
    expect(qu2.getNews().length).toEqual(0);
    done();
  }, 1050);
});

test("interval测试，组合使用技巧quickUnmq版本", function (done) {
  const quickUnmq = createQuickUnmq(new Exchange<number>(), {
    qu1: new Queue<number>().add(interval(100)),
  });
  const qu2 = new Queue<number>().add(throttleTime(200, true));
  //将qu1的内容发射到qu2上，并在qu2上做其他业务操作
  quickUnmq.on("qu1", (res: number) => {
    qu2.pushContent(res);
  });

  let num2 = "";
  qu2.pushConsume((res: number) => {
    num2 += res;
  });
  setTimeout(() => {
    expect(num2).toEqual("13579");
    expect(qu2.getNews().length).toEqual(0);
    done();
  }, 1050);
});
