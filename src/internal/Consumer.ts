import { ComponentEnum } from "../utils/types";
import { isPromise, random } from "../utils/tools";
import Logs from "./Logs";
import News from "./News";
export type Next = (value?: boolean) => void;

export interface Consume<D> {
  (content: D, next?: Next, payload?: any): Promise<any> | any;
  (content: D, payload?: any): any;
}
type ThenParameter = (isOk: boolean) => void;
interface Payload {
  then: (res: ThenParameter) => void;
}
export default class Consumer<D> {
  [k: string]: any;
  /**
   * id
   */
  private readonly id: string = random();
  getId() {
    return this.id;
  }
  /**
   * 消费者创建时间戳
   */
  createdTime: number;
  /**
   * 消费方法
   */
  consume: Consume<D>;
  /**
   * 固定参数
   */
  payload?: any;
  constructor(consume: Consume<D>, payload?: any) {
    this.createdTime = new Date().getTime();
    this.consume = consume;
    this.payload = payload;
    Logs.getLogsInstance()?.setLogs(ComponentEnum.CONSUMER, { id: this.getId(), createdTime: this.createdTime });
  }
  /**
   * 消费消息
   * @param news
   * @param ask
   * @returns
   */
  consumption(news: News<D>, ask: boolean): Payload {
    Logs.getLogsInstance()?.setLogs(ComponentEnum.CONSUMER, { id: this.getId(), createdTime: this.createdTime, accepted: 1 });
    const then = (thenParameter: ThenParameter) => {
      //不加入任务队列，会导致消费失败的数据重写到队列失败
      try {
        if (!ask) {
          //不需要确认的消费方法
          this.consume(news.content, this.payload);
          return thenParameter(true);
        }
        //构建消息确认的方法
        const confirm: Next = (value = true) => thenParameter(value);
        //需要确认的消费方法
        const res = this.consume(news.content, confirm, this.payload);
        //如果消息需要确认，且返回的内容为Promise
        if (isPromise(res)) {
          res
            .then(onfulfilled => {
              thenParameter(Boolean(onfulfilled));
            })
            .catch(() => {
              thenParameter(false);
            });
        } else if (typeof res === "boolean") {
          thenParameter(res);
        }
      } catch (error) {
        Logs.getLogsInstance()?.setLogs(ComponentEnum.CONSUMER, { id: this.getId(), createdTime: this.createdTime, message: JSON.stringify(error) });
        thenParameter(!ask);
      }
    };
    return {
      then,
    };
  }
}
