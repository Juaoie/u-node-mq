import UNodeMQ, { Exchange, Queue } from "../dist";

const unmq = new UNodeMQ(
  {
    //创建获取到openid的交换机
    GET_OPENID: new Exchange({ routes: ["ADD_DEMO_PSEUDO_DATA"] }),
    //创建切换问岛tabs索引的交换机
    CHANGE_QUESTION_TABS_CURRENT: new Exchange({ routes: ["HOME_ALL_QUESTION"] }),
  },
  {
    //ADD_DEMO_PSEUDO_DATA 添加用户伪数据
    ADD_DEMO_PSEUDO_DATA: new Queue(),
    //创建切换问岛tabs索引的队列
    HOME_ALL_QUESTION: new Queue(),
  }
);
export default unmq;
unmq.emit("CHANGE_QUESTION_TABS_CURRENT", "aaaa");
unmq.once("HOME_ALL_QUESTION", (res) => {
  console.log("🚀 ~ file: index.ts ~ line 21 ~ unmq.on ~ res", res);
});

import { IframeMessage, OtherIframe, SelfIframe, SelfQueue } from "@/plugins/message/index";

//其他交换机name变成必选了
const iframeMessage = IframeMessage.createIframe(
  "test1",
  new SelfIframe({ routes: ["queue1"] }),
  { test2: new OtherIframe() },
  { queue1: new SelfQueue() }
);

const iframeMessage2 = new IframeMessage(
  "test1",
  new SelfIframe({ routes: ["queue1"] }),
  { test2: new OtherIframe() },
  { queue1: new SelfQueue() }
);

iframeMessage.emit("123");
iframeMessage2.emit("123");
