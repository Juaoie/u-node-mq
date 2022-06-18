type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;
type PluginInstallFunction = <ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>>(
  unmq: UNodeMQ<ExchangeCollection, QueueCollection>,
  ...options: any[]
) => void;
type Plugin =
  | (PluginInstallFunction & {
      install?: PluginInstallFunction;
    })
  | {
      install: PluginInstallFunction;
    };
export declare function createUnmq<ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>>(
  exchangeCollection: ExchangeCollection,
  queueCollection: QueueCollection,
): UNodeMQ<ExchangeCollection, QueueCollection>;
/**
 * UNodeMQ 发布订阅模型
 */
export default class UNodeMQ<
  ExchangeCollection extends Record<string, Exchange<any>>,
  QueueCollection extends Record<string, Queue<any>>,
> extends Collection<ExchangeCollection, QueueCollection> {
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection);
  private readonly installedPlugins;
  use(plugin: Plugin, ...options: any[]): this;
  /**
   * 发射数据到交换机
   * @param contentList 消息体列表
   * @returns
   */
  emit<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this;
  /**
   * 发射数据到队列
   * @param queueName
   * @param contentList
   * @returns
   */
  emitToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: ReturnPanShapeQueue<QueueCollection[Q]>[]): this;
  /**
   *  订阅队列消息
   * 队列名称为null 则订阅所有队列
   * 消费方法
   * @param queueName 队列名称
   * @param consume 消费方法
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): () => this;
  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
  off<Q extends keyof QueueCollection>(queueName: Q): this;
  /**
   * 订阅一条消息
   * 不传入消费方法，则返回Promise<D>
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): this;
  once<Q extends keyof QueueCollection & string>(queueName: Q): Promise<ReturnPanShapeQueue<QueueCollection[Q]>>;
}
/**
 * 快速创建unmq的方法
 * @param exchange
 * @param queueCollection
 */
export declare function createQuickUnmq<D, QueueCollection extends Record<string, Queue<D>>>(
  exchange: Exchange<D>,
  queueCollection: QueueCollection,
): QuickUNodeMQ<D, QueueCollection>;
/**
 * 快速unmq
 * 仅有一个交换机和多个队列
 */
export declare class QuickUNodeMQ<D, QueueCollection extends Record<string, Queue<D>>> {
  private readonly exchange;
  private readonly queueCollection;
  constructor(exchange: Exchange<D>, queueCollection: QueueCollection);
  /**
   * 发射数据到交换机
   * @param contentList 消息体列表
   * @returns
   */
  emit(...contentList: D[]): this;
  /**
   * 发射数据到队列
   * @param queueName
   * @param contentList
   * @returns
   */
  emitToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: D[]): this;
  /**
   *  订阅队列消息
   * 队列名称为null 则订阅所有队列
   * 消费方法
   * @param queueName 队列名称
   * @param consume 消费方法
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any): () => this;
  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<D>): this;
  off<Q extends keyof QueueCollection>(queueName: Q): this;
  /**
   * 订阅一条消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any): this;
  once<Q extends keyof QueueCollection & string>(queueName: Q): Promise<D>;
}

declare class Collection<ExchangeCollection extends Record<string, Exchange<unknown>>, QueueCollection extends Record<string, Queue<unknown>>> {
  private readonly exchangeCollectionHandle;
  private readonly queueCollectionHandle;
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection);
  getExchange<E extends keyof ExchangeCollection & string>(exchangeName: E): Exchange<unknown> | null;
  getExchangeList(): Exchange<any>[];
  getQueue<Q extends keyof QueueCollection & string>(queueName: Q): Queue<unknown> | null;
  getQueueList(): Queue<any>[];
  addQueue(queue: Queue<unknown>): void;
  /**
   * 发送消息到交换机
   * @param exchangeName
   * @param news
   */
  pushNewsListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...news: News<unknown>[]): void;
  /**
   * 发送消息到队列
   * @param queueName
   * @param news
   */
  pushNewsListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...news: News<unknown>[]): void;
  /**
   * 发送消息内容到交换机
   * @param exchangeName
   * @param contentList
   */
  pushContentListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: unknown[]): void;
  /**
   *  发送消息内容到队列
   * @param queueName
   * @param contentList
   */
  pushContentListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: unknown[]): void;
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   */
  subscribeQueue<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<any>, payload?: any): void;
  /**
   * 取消订阅队列
   */
  unsubscribeQueue<Q extends keyof QueueCollection & string>(queueName: Q, consume?: Consume<any>): void;
}
/**
 * 中继器类型
 */
declare type Repeater<D> = (content: D) => Promise<string[]> | string[];
declare type ExchangeOption<D> = {
  routes?: string[];
  repeater?: Repeater<D>;
  name?: string;
  [k: string]: any;
};
/**
 * 交换机
 */
export declare class Exchange<D> {
  [k: string]: any;
  name?: string;
  /**
   * id
   */
  private readonly id;
  getId(): string;
  /**
   * 静态路由
   */
  private routes;
  getRoutes(): string[];
  pushRoutes(routes: string[]): void;
  setRoutes(routes: string[]): void;
  /**
   * 动态路由（中继器）
   */
  private repeater;
  getRepeater(): Repeater<D>;
  setRepeater(repeater: Repeater<D>): void;
  constructor(option?: ExchangeOption<D>);
  /**
   * 删除routes
   * @param routes
   */
  removeRoutes(routes?: string[]): void;
  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  getQueueNameList(content: D): Promise<string[]>;
}
interface QueueOption {
  ask?: boolean;
  rcn?: number;
  mode?: ConsumMode;
  name?: string;
  async?: boolean;
  maxTime?: number;
  [k: string]: any;
}
export declare enum ConsumMode {
  "Random" = "Random",
  "All" = "All",
}
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
  /**
   * 消息被弹出来
   */
  ejectedNews?: (news: News<D>) => boolean | Promise<boolean>;
}
declare type Operator<D> = AsyncOperator<D> & SyncOperator<D>;
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 */
export declare class Queue<D> {
  [k: string]: any;
  name?: string;
  /**
   * id
   */
  private readonly id;
  getId(): string;
  /**
   * 是否需要消息确认
   */
  ask: boolean;
  /**
   * 可重新消费次数，消费失败会重复消费
   */
  rcn: number;
  /**
   * 消费模式
   * - Random 随机抽取消费者消费
   * - All 一条消息所有消费者都消费
   */
  mode: ConsumMode;
  /**
   * 默认是同步消费
   * 是否是异步消费，如果是同步消费，则一条消息消费完成或者消费失败才会消费下一条消息
   * 为同步消费时，mode为ALL则需要所有消费者都消费完或者消费失败才能消费下一条消息
   */
  async: boolean;
  /**
   * 消费状态，true为正在消费，false为未在消费
   * 用于同步消费判断当前的消费状态
   */
  private state;
  /**
   * 每个消费者最长消费时长
   * 同步阻塞型代码计算所花时长不计算入内，仅仅控制异步消费者消费代码所花时长
   * 设置为-1表示无时长限制
   * 在ask为true和async为false的情况下设置maxTime为-1可能会导致队列将被阻塞
   */
  maxTime: number;
  /**
   * 消息 list
   */
  private news;
  getNews(): News<D>[];
  /**
   * 移除所有消息
   * @returns
   */
  removeAllNews(): boolean;
  /**
   * 加入消息
   * @param news
   */
  pushNews(news: News<D>): void;
  /**
   * 加入消息内容
   * @param content
   */
  pushContent: (content: D) => void;
  /**
   * 通过id移除指定消息
   * @param newsId
   * @returns
   */
  removeNewsById(newsId: string): boolean;
  /**
   * 消费者 list
   */
  private consumerList;
  getConsumerList(): Consumer<D>[];
  /**
   * 加入消费者
   * @param consumerList
   */
  pushConsumer(consumer: Consumer<D>): void;
  /**
   *
   * 通过消费方法移除指定消费者
   * @param consume
   * @returns
   */
  removeConsumer(consume: Consume<D>): boolean;
  /**
   * 加入消费者消费主体
   *
   * @param consume
   * @param payload 消费载体，每次消费都会传入给消费者
   */
  pushConsume(consume: Consume<D>, payload?: any): void;
  /**
   * 通过id移除指定消费者
   * @param consumerId
   * @returns
   */
  removeConsumerById(consumerId: string): boolean;
  /**
   * 移除所有消费者
   * @returns
   */
  removeAllConsumer(): boolean;
  /**
   * 操作符集合
   */
  private operators;
  /**
   * 添加钩子函数方法
   * @param operator
   * @returns
   */
  add(...operators: Operator<D>[]): this;
  /**
   * 管道操作符执行
   * 其中需要阻塞获取返回值（boolea）的是按顺序执行的，如果不需要
   * @param fun
   * @param args
   * @returns
   */
  private operate;
  constructor(option?: QueueOption);
  /**
   * 消费方法
   * 每次执行消费一条消息
   * @returns
   */
  consumeNews(): Promise<void>;
  /**
   * 指定消费者消费某一条消息的方法
   * @param news
   * @param consumer
   * @returns
   */
  consumption(news: News<D>, consumer: Consumer<D>): Promise<boolean>;
}
/**
 * 消息
 */
export declare class News<D> {
  [k: string]: any;
  /**
   * id
   */
  private readonly id;
  getId(): string;
  /**
   * 消费者创建时间戳
   */
  readonly createTime: number;
  /**
   * 消息内容
   */
  content: D;
  /**
   * 剩余可重复消费次数
   */
  consumedTimes: number;
  constructor(content: D);
}
/**
 * 确认消息
 */
declare type Next = (value?: boolean) => void;
/**
 * 消费方法
 */
interface Consume<D> {
  (content: D, next?: Next, payload?: any): Promise<any> | any;
  (content: D, payload?: any): any;
}
declare type ThenParameter = (isOk: boolean) => void;
interface Payload {
  then: (res: ThenParameter) => void;
}
/**
 * 消费者
 */
export declare class Consumer<D> {
  [k: string]: any;
  /**
   * id
   */
  private readonly id;
  getId(): string;
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
  constructor(consume: Consume<D>, payload?: any);
  /**
   * 消费消息
   * @param news
   * @param ask
   * @returns
   */
  consumption(news: News<D>, ask: boolean): Payload;
}
export declare class Logs {
  static unmq: null;
  static error(message: any): void;
  static log(message: any): void;
}
