import { News, Queue, Consumer } from "../..";
/**
 * 会异步执行的运算方法
 * 不需要通过返回值控制是否继续执行流程
 */
interface AsyncOperator<D> {
  /**
   * 操作挂载执行方法
   * 多个操作符的同个钩子函数会同时执行，所以应该谨慎操作数据，避免产生异步操作数据的问题
   */
  mounted?: (that: Queue<D>) => unknown;
  /**
   * 消息成功添加到队列以后
   */
  addedNews?: (news: News<D>) => unknown;

  /**
   * 消费者成功加入到队列以后
   */
  addedConsumer?: (consumer: Consumer<D>) => unknown;
  /**
   * 消费者成功被移除以后
   * consumerList 被删除的消费列表
   */
  removedConsumer?: (consumerList: Consumer<D>[]) => unknown;
}

/**
 * 会同步的执行的运算符方法
 * 每个运算符方法列表都会同步执行，且一个返回false，后面则不会继续执行，用于控制流程是否继续
 */
interface SyncOperator<D> {
  /**
   * 将消息添加到队列之前
   * 返回的boolean控制消息是否加入队列
   */
  beforeAddNews?: (news: News<D>) => boolean | Promise<boolean>;
  /**
   * 加入消费者之前
   * 返回的boolean控制消费者是否能加入队列
   */
  // beforeAddConsumer?: (consumer: Consumer<D>) => boolean | Promise<boolean>;

  /**
   * 控制消息是否可以被弹出，为false则移除消息
   */
  ejectNews?: (news: News<D>) => boolean | Promise<boolean>;
}

/**
 * 异步运算符
 * @param arg
 * @returns
 */
export function isAsyncOperator<D>(arg: keyof Operator<D>): arg is keyof AsyncOperator<D> {
  return ["mounted", "addedNews", "addedConsumer", "removedConsumer"].indexOf(arg) !== -1;
}
/**
 * 同步运算符
 * @param arg
 * @returns
 */
export function isSyncOperator<D>(arg: keyof Operator<D>): arg is keyof SyncOperator<D> {
  return ["beforeAddNews", "ejectNews"].indexOf(arg) !== -1;
}
/**
 * 队列和消息在队列中的生命周期
 */
export type Operator<D> = AsyncOperator<D> & SyncOperator<D>;
