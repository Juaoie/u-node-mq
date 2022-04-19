import UNodeMQ, { Exchange, Queue } from "../src/index";
import StoragePlugin from "../src/plugins/storage/index";
import { describe, expect, test } from "@jest/globals";

test("storage的基本使用方法", function (done) {
  const qu = {
    qu1: new Queue(),
    qu2: new Queue(),
    qu3: new Queue(),
    qu4: new Queue(),
  };
  const unmq = new UNodeMQ(
    {
      ex1: new Exchange({ routes: ["qu1"] }),
    },
    qu
  );
  interface D {
    storage: typeof qu;
    init: () => void;
  }
  const res = unmq.use<D>(new StoragePlugin());
  console.log("🚀 ~ file: storage.test.ts ~ line 18 ~ res", res.storage.qu1);
  done();
});
