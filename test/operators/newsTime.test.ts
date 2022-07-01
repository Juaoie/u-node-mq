import { Exchange, Queue, createQuickUnmq } from "../../src/index";
import newsTime from "../../src/operators/newsTime";

import { expect, test } from "@jest/globals";

test("快速unmq，newsTime测试", function (done) {
  const qu1 = new Queue<number>().add(newsTime(1000)).add(newsTime(1200));
  const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
    qu1,
  });
  let str = "";
  setTimeout(() => {
    quickUnmq.once("qu1", () => (str += "a"));
  }, 500);
  setTimeout(() => {
    quickUnmq.once("qu1", () => (str += "b"));
  }, 1500);
  setTimeout(() => {
    expect(str).toEqual("a");
    expect(qu1.getNews().length).toEqual(0);
    done();
  }, 2000);
  quickUnmq.emit(1, 2, 3);
});
