"use strict";
exports.__esModule = true;
console.log("测试index.ts执行");
var UNodeMQ_1 = require("../dist/UNodeMQ");
var unmq = new UNodeMQ_1["default"]();
//创建组合报告交换机
//STUDENT_DATA 学生数据
var exc = unmq.createExchange("COMBO_REPORT", ["STUDENT_DATA"], null);
var que = unmq.createQueue("STUDENT_DATA");
unmq.emit("COMBO_REPORT", 123);
unmq.on("STUDENT_DATA", fun);
function fun(data) {
    console.log("接受到参数");
    console.log(data);
}
