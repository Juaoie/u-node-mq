"use strict";
exports.__esModule = true;
var src_1 = require("../src");
var unmq = new src_1["default"]({
    //创建获取到openid的交换机
    "GET_OPENID": new src_1.Exchange({ routes: ["ADD_DEMO_PSEUDO_DATA"] }),
    //创建切换问岛tabs索引的交换机
    "CHANGE_QUESTION_TABS_CURRENT": new src_1.Exchange({ routes: ["HOME_ALL_QUESTION"] })
}, {
    //ADD_DEMO_PSEUDO_DATA 添加用户伪数据
    "ADD_DEMO_PSEUDO_DATA": new src_1.Queue(),
    //创建切换问岛tabs索引的队列
    "HOME_ALL_QUESTION": new src_1.Queue()
});
exports["default"] = unmq;
console.log("🚀 ~ file: index.ts ~ line 18 ~ unmq", unmq);
unmq.emit("GET_OPENID", "123232323");
