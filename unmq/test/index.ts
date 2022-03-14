import UNodeMQ, { Exchange, Queue } from "../src";

const unmq = new UNodeMQ(
  {
    //创建获取到openid的交换机
    "GET_OPENID": new Exchange({ routes: ["ADD_DEMO_PSEUDO_DATA"] }),
    //创建切换问岛tabs索引的交换机
    "CHANGE_QUESTION_TABS_CURRENT": new Exchange({ routes: ["HOME_ALL_QUESTION"] }),
  },
  {
    //ADD_DEMO_PSEUDO_DATA 添加用户伪数据
    "ADD_DEMO_PSEUDO_DATA": new Queue(),
    //创建切换问岛tabs索引的队列
    "HOME_ALL_QUESTION": new Queue(),
  },
);
export default unmq;
console.log("🚀 ~ file: index.ts ~ line 18 ~ unmq", unmq);
unmq.emit("GET_OPENID", "123232323");
