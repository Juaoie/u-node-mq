import Exchange from "./exchange";
import Queue, { QueueName } from "./queue";
import News from "./news";
import Consumer, { Next } from "./consumer";
import { Consume } from "./consumer";
import Logs from "./logs";
import UnmqFactory from "./UnmqFactory";

interface Option {
  exchangeName?: string;
  queueNameList?: string[];
  ask?: boolean;
}
export type PluginInstallFunction<D> = (unmq: UNodeMQ<D>, ...options: any[]) => any;
export type Plugin<D> =
  | (PluginInstallFunction<D> & {
      install?: PluginInstallFunction<D>;
    })
  | {
      install: PluginInstallFunction<D>;
    };
/**
 * unmq：
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
export default class UNodeMQ<D> extends Exchange {
  constructor(option?: Option) {
    //先创建交换机
    super({ name: option.exchangeName || "exchange" });

    if (option.queueNameList !== undefined) {
      //添加队列列表
      super.pushQueueList(option.queueNameList, option.ask);
      //添加静态路由
      super.pushRoutes(option.queueNameList);
    }
  }
  /**
   * 发射数据
   * @param contentList 消息体列表
   * @returns
   */
  emit(...contentList: D[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      super.pushNewsToQueueList(content);
    }
    return this;
  }

  /**
   *  订阅队列消息
   * 队列名称为null 则订阅所有队列
   * 消费方法
   * @param queueName 队列名称
   * @param consume 消费方法
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on(queueName: QueueName | null, consume: Consume<D>, payload?: any) {
    if (queueName === null) super.pushConsumeToAllQueue(consume, payload);
    else super.pushConsumeToSingleQueue(queueName, consume, payload);
    //直接return 需要off传递参数
    // return () => this.off(queueName, consume);
  }
  off(queueName: QueueName | null, consume: Consume<D>) {
    const queue = this.queueList.find((item) => item.name === queueName);
    if (queue === undefined) Logs.error(`${queueName} queue not find`);
    else queue.delConsumer(consume); 
    return this;
  }
}

const unmq = new UNodeMQ<string>();
