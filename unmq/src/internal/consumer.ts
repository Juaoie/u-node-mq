import Tools from "../utils/tools";
import Logs from "./Logs";
import News from "./News";
export type Next = (value: boolean) => void;

export type Consume<D> = (content: D, next?: Next, payload?: any) => Promise<boolean> | boolean | void;
export interface ConsumptionStatus<D> {
  isOk: boolean;
  consumer: Consumer<D>;
  news: News<D>;
}
type ThenParameter<D> = (res: ConsumptionStatus<D>) => void;
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
        const confirm: Next = (value = true) => thenParameter({ isOk: value, consumer: this, news });
        const res = this.consume(news.content, ask ? confirm : undefined, this.payload);
        if (ask === false) return thenParameter({ isOk: true, consumer: this, news });
        if (res instanceof Promise) {
          res
            .then(onfulfilled => {
              thenParameter({ isOk: onfulfilled, consumer: this, news });
            })
            .catch(() => {
              thenParameter({ isOk: false, consumer: this, news });
            });
        } else {
          thenParameter({
            isOk: Boolean(res),
            consumer: this,
            news,
          });
        }
      } catch (error) {
        Logs.error("Consumer consumption error");
        thenParameter({ isOk: false, consumer: this, news });
      }
    };
    return {
      then,
    };
  }
}
