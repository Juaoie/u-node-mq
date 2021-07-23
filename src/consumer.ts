import News from "./news";
import Tools from "./utils/tools";

type Consume = (news: News) => Promise<Boolean> | void;

export default class Consumer {
  /**
   * id
   */
  id: string;
  /**
   * 消费者创建时间戳
   */
  createTime: number;
  /**
   * 消费方法
   */
  consume: Consume;
  constructor(consume: Consume) {
    this.id = Tools.random();
    this.createTime = new Date().getTime();
    this.consume = consume;
  }
}
