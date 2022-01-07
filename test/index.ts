import UNodeMQ from "../dist/UNodeMQ";
import Process from "../dist/plugin/process";
const userLoggedProcess = new Process("USER_AUTH", "USER_COUPONS", "USER_NEWTASK");

userLoggedProcess.emit("USER_AUTH");

userLoggedProcess.on("USER_AUTH", test);

userLoggedProcess.off("USER_AUTH", test);
console.log("🚀 ~ file: index.ts ~ line 10 ~ userLoggedProcess", JSON.parse(JSON.stringify(userLoggedProcess.unmq.queueList[0])));

function test() {}
