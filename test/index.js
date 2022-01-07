"use strict";
exports.__esModule = true;
var process_1 = require("../dist/plugin/process");
var userLoggedProcess = new process_1["default"]("USER_AUTH", "USER_COUPONS", "USER_NEWTASK");
userLoggedProcess.emit("USER_AUTH");
userLoggedProcess.on("USER_AUTH", test);
userLoggedProcess.off("USER_AUTH", test);
console.log("🚀 ~ file: index.ts ~ line 10 ~ userLoggedProcess", JSON.parse(JSON.stringify(userLoggedProcess.unmq.queueList[0])));
function test() { }
