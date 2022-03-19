import UNodeMQ, { Exchange, Queue } from "../dist/index";

const unmq = new UNodeMQ(
  {
    //创建获取到openid的交换机
    GET_OPENID: new Exchange<string>({ routes: ["ADD_DEMO_PSEUDO_DATA"] }),
    //创建切换问岛tabs索引的交换机
    CHANGE_QUESTION_TABS_CURRENT: new Exchange({ routes: ["HOME_ALL_QUESTION"] }),
  },
  {
    //ADD_DEMO_PSEUDO_DATA 添加用户伪数据
    ADD_DEMO_PSEUDO_DATA: new Queue<string>(),
    //创建切换问岛tabs索引的队列
    HOME_ALL_QUESTION: new Queue<number>(),
  }
);

unmq.emit("GET_OPENID", "");
unmq.on("ADD_DEMO_PSEUDO_DATA", (res) => {});
unmq.on("HOME_ALL_QUESTION", (res) => {});

import IframeMessage, { OtherIframe, SelfIframe, SelfQueue } from "../dist/plugins/message";

//其他交换机name变成必选了
const iframeMessage = new IframeMessage(
  "test1",
  new SelfIframe({ routes: ["queue1"] }),
  { ex1: new OtherIframe<number>() },
  { qu1: new Queue<number>() }
);

iframeMessage.emit("ex1", 1, 2);

iframeMessage.on("qu1", (res) => {});
