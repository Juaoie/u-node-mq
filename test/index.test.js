const UNodeMQ = require("../index.js");
const Exchange = require("../index.js").Exchange;
console.log("🚀 ~ file: index.test.js ~ line 3 ~ Exchange", Exchange)

it("自动写入交换机和队列名称功能", function () {
  const unmq = new UNodeMQ({
    ex1: new Exchange(),
  });
  expect(unmq.getExchange("ex1").name).to.be.equal("ex1");
});
