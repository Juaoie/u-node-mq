import { Exchange } from "./exchange";
import { Queue } from "./queue";

/**
 * 一个unodemq实例是一个mq典型模型
 * 开发者可以随意组合不同模块从而实现不同的mq模型
 *
 * 这里消息发送通知的机制和一般消息队列不太一样
 * 一般的消息发送属于监听消息队列消息状态，然后发送消息，如果消费失败，将会有重发消息机制
 * 因为前端模块相互通信的特殊情况，这里并不能采用监听消息队列消息状态的方式进行消息发送，
 * 也不会有死循环形式的消息重发机制
 * 这里发送消息情况为以下两种
 *  1、当订阅事件初始化成功后
 *  2、收到消息进入后
 *
 */
export default class Unodemq {
  constructor(private queueList: Queue[], private exchange?: Exchange) {}
  /**
   * 发送数据给单个队列
   * @param queueName
   * @param news
   */
  private sendMessageToQueue(queueName: string, news: any) {
    const queue: Queue = this.queueList.find(
      (item: Queue) => item.getQueueName() === queueName
    );
    if (queue === undefined) throw `队列${queueName}不存在`;
    queue.pushQueueNews(news);
  }
  /**
   * 发送消息给交换机
   * @param news
   * @returns
   */
  private sendMessageToExchange(news: any) {
    if (this.exchange === undefined) throw "交换机不存在";
    const queueName: string | string[] = this.exchange.flow(news);
    //如果只返回一个队列
    if (typeof queueName === "string")
      return this.sendMessageToQueue(queueName, news);
    //如果返回多个队列
    queueName.forEach((item: string) => {
      this.sendMessageToQueue(item, news);
    });
  }
  $emit(queueName: string, news: any): void;
  $emit(news: any): void;
  $emit(queueName: any, news?: any): void {
    if (queueName === undefined) throw "缺少参数";
    //发送消息给交换机
    if (news === undefined) this.sendMessageToExchange(queueName);
    //发送消息给队列
    else if (typeof queueName === "string" && news !== undefined)
      this.sendMessageToQueue(queueName, news);
  }
  /**
   * 订阅消息
   * @param queueName
   * @param consumer
   * @param options
   */
  $on(
    queueName: string,
    fun: (data: any) => Promise<boolean> | void,
    consumerOptions?: ConsumerOptions
  ) {
    const queue: Queue = this.queueList.find(
      (item: Queue) => item.getQueueName() === queueName
    );
    if (queue === undefined) throw `队列${queueName}不存在`;
    const consumer: Consumer = new Consumer(fun, consumerOptions);
    //添加消费者
    queue.pushConsumer(consumer);
    //消费消息
    queue.sendMessageToConsumer(consumer);
  }
  /**
   * 取消订阅消息
   * @param queueName
   * @param fun
   */
  $off(queueName: string, fun: (data: any) => Promise<boolean> | void) {
    const queue: Queue = this.queueList.find(
      (item: Queue) => item.getQueueName() === queueName
    );
    if (queue === undefined) throw `队列${queueName}不存在`;
    //删除消费者
    queue.deleteConsumer(fun);
  }
}

// this.$mq.basicConsume("1223",this.aa,)
// function aa (data,askFun,{ask:true}){
// askFun()
// }
