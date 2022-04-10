import unmq from "./index.js";

/**
 * ex2.js 模块
 *
 * 交换机有ex2
 *
 * 队列有qu2
 *
 * 通过同时emit 多个消息，展示获取消息
 */
const consumer = (res, payload) => {
  alert(res + "：" + payload);
};

unmq.on("qu2", consumer, "我是固定的数据");
