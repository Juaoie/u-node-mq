import { Queue } from "../../src/index";
import instant from "../../src/operators/instant";

import { expect, test } from "@jest/globals";

test("快速unmq，instant测试", function (done) {
  const qu1 = new Queue<number>()
    //使用 operate
    .add(instant());
  setTimeout(() => {
    expect(qu1.getNews().length).toEqual(0);
    done();
  }, 100);
  [1, 2, 3, 4, 5, 6].forEach(res => {
    qu1.pushContent(res);
  });
});
