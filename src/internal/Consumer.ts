import Tools from "../utils/tools.js";
import Logs from "./Logs.js";
import News from "./News.js";
export type Next = (value?: boolean) => void;

export type Consume<D> = (content: D, next?: Next, payload?: any) => Promise<boolean> | boolean | void;
type ThenParameter<D> = (isOk: boolean) => void;
interface Payload<D> {
  then: (res: ThenParameter<D>) => void;
}
export default class Consumer<D> {
  /**
   * id
   */
  private readonly id: string = Tools.random();
  getId() {
    return this.id;
  }
  /**
   * 消费者创建时间戳
   */
  createTime: number;
  /**
   * 消费方法
   */
  consume: Consume<D>;
  /**
   * 固定参数
   */
  payload?: any;
  constructor(consume: Consume<D>, payload?: any) {
    this.createTime = new Date().getTime();
    this.consume = consume;
    this.payload = payload;
  }
  /**
   * 消费消息
   * @param news
   * @param ask
   * @returns
   */
  consumption(news: News<D>, ask: boolean): Payload<D> {
    const then = (thenParameter: ThenParameter<D>) => {
      //不加入任务队列，会导致消费失败的数据重写到队列失败
      try {
        if (!ask) {
          //不需要确认的消费方法
          this.consume(news.content, this.payload);
          return thenParameter(true);
        }
        //构建消息确认的方法
        let confirm: Next = (value = true) => thenParameter(value);
        //需要确认的消费方法
        const res = this.consume(news.content, confirm, this.payload);
        //如果消息需要确认，且返回的内容为Promise
        if (res instanceof Promise) {
          res
            .then((onfulfilled) => {
              thenParameter(onfulfilled);
            })
            .catch(() => {
              thenParameter(false);
            });
        } else if (typeof res === "boolean") {
          confirm = () => {};
          thenParameter(res);
        }
      } catch (error) {
        Logs.error("Consumer consumption error");
        thenParameter(false);
      }
    };
    return {
      then,
    };
  }
}