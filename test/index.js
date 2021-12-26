"use strict";
exports.__esModule = true;
var UNodeMQ_1 = require("../dist/UNodeMQ");
var unmq = new UNodeMQ_1["default"]({ exchangeName: "exch", queueNameList: ["123"] });
unmq.exchange.routes = ["123"];
unmq.emit("消息内容1", "消息2");
unmq.once("123", function (value) {
    console.log(value);
});
unmq.once("123", function (value) {
    console.log(value);
});
