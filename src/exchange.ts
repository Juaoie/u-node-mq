import News from "./news";
import Queue from "./queue";
import Tools from "./utils/tools";

type Repeater = (content: any) => string[];

type Option = {
  name: string;
  routes?: string[];
  queues?: Queue[];
  repeater?: Repeater;
};

/**
 * 交换机
 */
export default class Exchange {
  /**
   * id
   */
  id: string;
  /**
   * 交换机名字
   */
  name: string;
  /**
   * 需要匹配的队列名称
   */
  routes: string[];
  /**
   * 队列列表
   */
  queues: Queue[];
  /**
   * 中继器
   */
  repeater: Repeater;

  constructor(option: Option) {
    this.name = option.name;
    this.routes = option.routes;
    this.queues = option.queues;
    this.repeater = option.repeater;
    this.id = Tools.random();
  }
  /**
   * 获取单个队列
   * @param queueName
   * @returns
   */
  getQueue(queueName: String): Queue {
    const queue: Queue = this.queues.find((item) => item.name === queueName);
    if (queue === undefined) throw `队列${queue}不存在`;
    return queue;
  }
  emit( news:News){
    //中继器存在
    if(this.repeater){

    }else {
      const 
    }

    
  }
}
