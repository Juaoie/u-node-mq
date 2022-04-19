import UNodeMQ, { Exchange, Queue } from "../src/index";
import { describe, expect, test } from "@jest/globals";
// import IframePlugin from "../src/plugins/iframe/index";

test("普通挂载", function (done) {
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    {
      qu1: new Queue(),
    }
  );
  // unmq.use(new IframePlugin("ex1"));
  done();
});
