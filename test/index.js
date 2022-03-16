"use strict";
exports.__esModule = true;
var dist_1 = require("../dist");
var unmq = new dist_1["default"]({
    //创建获取到openid的交换机
    "GET_OPENID": new dist_1.Exchange({ routes: ["ADD_DEMO_PSEUDO_DATA"] }),
    //创建切换问岛tabs索引的交换机
    "CHANGE_QUESTION_TABS_CURRENT": new dist_1.Exchange({ routes: ["HOME_ALL_QUESTION"] })
}, {
    //ADD_DEMO_PSEUDO_DATA 添加用户伪数据
    "ADD_DEMO_PSEUDO_DATA": new dist_1.Queue(),
    //创建切换问岛tabs索引的队列
    "HOME_ALL_QUESTION": new dist_1.Queue()
});
exports["default"] = unmq;
unmq.emit("CHANGE_QUESTION_TABS_CURRENT", "aaaa");
unmq.once("HOME_ALL_QUESTION", function (res) {
    console.log("🚀 ~ file: index.ts ~ line 21 ~ unmq.on ~ res", res);
});
