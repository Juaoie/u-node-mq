import Tools from "../utils/tools";
import Logs from "./logs";
import News from "./news";
export type Next = (value: boolean) => void;

export type Consume<D> = (content: D, next?: Next) => Promise<boolean> | boolean | void;
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
  readonly id: string = Tools.random();
  /**
   * 消费者创建时间戳
   */
  createTime: number;
  /**
   * 消费方法
   */
  consume: Consume<D>;
  constructor(consume: Consume<D>) {
    this.createTime = new Date().getTime();
    this.consume = consume;
  }
  consumption(news: News<D>, ask: boolean): Payload<D> {
    const then = (thenParameter: ThenParameter<D>) => {
      //不加入任务队列，会导致消费失败的数据重写到队列失败
      Tools.promiseSetTimeout().then(() => {
        try {
          const confirm: Next = (value) => thenParameter({ isOk: value, consumer: this, news });
          const res = this.consume(news.content, ask ? confirm : undefined);
          if (ask === false) return thenParameter({ isOk: true, consumer: this, news });
          if (res instanceof Promise) {
            res
              .then((onfulfilled) => {
                thenParameter({ isOk: onfulfilled, consumer: this, news });
              })
              .catch(() => {
                thenParameter({ isOk: false, consumer: this, news });
              });
          } else if (typeof res === "boolean") {
            return {
              isOk: res,
              consumer: this,
            };
          }
        } catch (error) {
          Logs.error("Consumer consumption error");
          thenParameter({ isOk: false, consumer: this, news });
        }
      });
    };
    return {
      then,
    };
  }
}
