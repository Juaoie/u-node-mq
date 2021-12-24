import Tools from "../utils/tools";
export type Next = (value: boolean) => void;

export type Consume<D> = (content: D, next?: Next) => Promise<boolean> | boolean | void;

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
}
