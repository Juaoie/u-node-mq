import { Consume } from "./consumer";
import Logs from "./logs";
import { QueueName } from "./queue";
import QueueCollection from "./queueCollection";
/**
 * 中继器类型
 */
type Repeater<D> = (content: D) => Promise<QueueName[]> | QueueName[];

export type Option<D> = {
  name: string;
  routes?: string[];
  repeater?: Repeater<D>;
};

/**
 * 交换机
 */
export default class Exchange<D = any> extends QueueCollection<D> {
  /**
   * 交换机名字
   */
  private readonly name: string;
  /**
   * 需要匹配的队列名称
   */
  private routes: QueueName[] = [];
  /**
   * 中继器
   */
  private repeater: Repeater<D>;

  constructor(option: Option<D>) {
    super();
    this.name = option.name;
    if (option.routes !== undefined) this.routes = option.routes;
    if (option.repeater !== undefined) this.repeater = option.repeater;
  }

  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  async getQueueNameList(content: D): Promise<QueueName[]> {
    try {
      //中继器模式
      if (this.repeater) {
        return await this.repeater(content);
      } else if (this.routes) {
        return this.routes;
      }
    } catch (error) {
      Logs.error(`${this.name} exchange function getQueueNameList exception`);
      return [];
    }
  }
  /**
   * 添加队列
   * @param queueNameList
   * @param ask
   */
  pushQueueList(queueNameList: QueueName[], ask?: boolean) {
    super.pushQueueList(queueNameList, ask);
  }
  /**
   * 添加静态路由，驱虫
   * @param routes
   */
  pushRoutes(routes: string[]) {
    this.routes = Array.from(new Set(this.routes.concat(routes)));
  }
  /**
   * 发送一条消息到队列列表
   * @param content
   */
  async pushNewsToQueueList(content: D) {
    //先获取所有可以挂载消息的队列名称
    const queueNameList = await this.getQueueNameList(content);
    for (const queueName of queueNameList) {
      //分别向每一条队列发送一条消息
      super.pushNewsToQueue(queueName, content);
    }
  }
  /**
   * 向所有队列添加消费者
   * @param queueName
   * @param consume
   * @param payload
   */
  pushConsumeToAllQueue(consume: Consume<D>, payload?: any) {
    const allQueueName = super.getAllQueueNameList();
    for (const queueName of allQueueName) {
      this.pushConsumeToSingleQueue(queueName,consume,payload)
    }
  }
  /**
   * 向指定队列添加消费者
   * @param queueName 
   * @param consume 
   * @param payload 
   */
  pushConsumeToSingleQueue(queueName:QueueName,consume:Consume<D>,payload?:any){
    super.pushConsumeToQueue(queueName,consume,payload)
  }
}
