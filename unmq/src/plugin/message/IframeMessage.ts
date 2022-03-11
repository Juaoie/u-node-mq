import UNodeMQ, { Exchange, Queue, News } from "../..";
import { ReturnPanShapeExchange } from "../../core/UNodeMQ";
import { getAllIframeDoc, getIframeNode } from "./loader";
import { sendMessage } from "./messageProcessing";
/**
 * postmessage 功能如下
 * 一、父通过contentWindow.postmessage 发送数据给指定的url 或者 *
 * contentWindow的为iframe实例对象，获取方式
 * 1.通过onload或者getElementById查询获取
 * 2.通过对window下属性直接引用获取，（一个窗口下所有直接子iframe都会挂载在window窗口下，所以iframe 实例是嵌套的）
 * 3.通过window.open打开窗口获取
 * 二、子通过window.top.postmessage 直接发送数据到父，
 * 三、兄弟通过window.top下的contentWindow.postmessage通信
 */
/**
 *
 * 每个应用维护一个route 表
 * 分布式
 * 有一个应用挂载则广播自己的坐标信息，其他应用也发送坐标信息到当前应用
 *
 * 消息确认，所有消息都回发一个确认消息
 *
 */

/**
 * 问题一：一个iframe 应用 是否 对应一个 exchange交换机？？？
 *
 * 如果一个应用 对应一个 交换机
 * 则，
 *  1.当前应用可以on 监听其他应用的队列消息，但是消息又不能发送到当前应用
 *  2.当前应用可以on 监听其他应用的队列消息，每次的消息都会广播发送，所以可以收到其他应用的消息
 *
 * 如果应用不对应交换机
 * 则，
 *  不需要维护route 表
 *  发送数据为广播发送，然后通过队列名称去筛选emit到指定队列
 *
 * 问题二：是否采用分布式同步路由表？？？
 *
 * 如果不采用分布式同步路由表
 * 则，
 *  只有基座应用有所有路由信息，兄弟应用传递消息需要经过基座应用转发
 *  基座应用必须要有所有应用的交换机，即使没有数据交互
 *  每次有应用加入需要传递路由信息给基座应用
 *  每次有应用卸载也需要传递信息给基座应用
 *
 * 如果采用分布式同步路由表
 * 则，
 *  每个应用都需要同步所有路由信息
 *  每次有应用加入需要广播自己的路由信息，其他应用在收到消息后回传自己的路由信息给当前应用
 *  每次有应用卸载也需要广播自己的路由信息，其他应用在收到消息后删除不需要的路由信息
 *
 *
 * 最终方案：
 *
 * 问题一：
 * 一个应用对应一个交换机
 * 当前应用的其他交换机不需要设置队列：因为当前应用发送数据只管数据发送给谁，不管发送到哪个队列
 * 自动为当前应用生成一个交换机
 * 用户为当前应用交换机设置队列用于接收数据
 *
 *
 * 问题二、
 * 使用分布式路由表
 * 这样不需要每次兄弟应用传值都需要基座应用修改代码
 *
 * 如何确定当前应用信息：
 * 坐标信息：通过遍历window.frame === self 得到当前应用的坐标信息
 * 应用名称：通过创建IframeMessage 传入的名称得到当前应用的名称
 * origin：通过window.origin得到
 *
 *
 *
 */

/**
 * 定义如下
 *
 *
 * 一个交换机对应一个iframe应用
 * 当前应用实例只需要注册有数据交互的应用交换机即可，同时也只需要注册需要发送数据的队列
 * 自己需要接受什么类型的数据则为自己创建什么类型的队列
 *
 *
 *
 *  如何分布式
 * 每个应用都会创建相同的
 */

/**
 * 需求：
 * 1.父子级 iframe 双向 通信
 * 2.使用postmessage进行消息确认
 * 3.兄弟iframe 双向通信，采用路由器模式交换 url id
 *
 *
 * 因为交换机到队列是确定的，所以不能给所有队列添加消费者，需要通过消息传递到队列以后判断是否存在iframe node 来动态添加消费者
 */

class Iframe<D> extends Exchange<D> {
  constructor(option: InstanceType<typeof Exchange>) {
    super(option);
  }
}
export class SelfIframe<D> extends Iframe<D> {}
export class OtherIframe<D> extends Iframe<D> {}
export class QueueExpand<D> extends Queue<D> {}
/**
 * 扩展消息，添加交换机名称，
 */
export class NewsExpand<D, ExchangeName> extends News<D> {
  constructor(content: D) {
    super(content);
  }
}
type Coordinate = {
  x: number;
  y: number;
  origin: string;
};

/**
 * 使用postMessage api 进行通信
 *
 */
export default class IframeMessage<
  ExchangeCollection extends Record<string, Iframe<unknown>>,
  QueueCollection extends Record<string, QueueExpand<unknown>>,
> {
  readonly name = "postMessage";
  private unmq: UNodeMQ<ExchangeCollection, QueueCollection>;
  constructor(selfExchangeName: string, selfQueueCollection: QueueCollection, exchangeCollection: ExchangeCollection) {
    /**
     * 内部队列
     */
    type InternalQueue = {
      //将自己的路由坐标和origin发送给基座iframe
      _sendRouter: QueueExpand<Coordinate>;
      //接受来自外边的消息，该消息用于通知我更新坐标到基座
      _updateRouter: QueueExpand<null>;
    };
    /**
     * 基座的iframe
     */
    type InternalIframe = {
      //自己的交换机，用于接受外边数据
      _selfIframe: Iframe<unknown>;
      //基座的交换机，用于发送数据给基座
      _masterIframe: Iframe<unknown>;
    };

    this.unmq = new UNodeMQ<ExchangeCollection & InternalIframe, QueueCollection & InternalQueue>(
      Object.assign(exchangeCollection, {
        _selfIframe: new Iframe<unknown>({ routes: ["_updateRouter"] }),
        _masterIframe: new Iframe<unknown>({ routes: ["_sendRouter"] }),
      }),
      Object.assign(queueCollection, {
        _sendRouter: new QueueExpand<Coordinate>({ ask: true }),
        _updateRouter: new QueueExpand<null>(),
      }),
    );
    /**
     * constructor执行以后需要发送更新消息
     */
    this.unmq.emit("_selfIframe", null);

    /**
     * 先为自己挂载消费_updateRouter的消费者
     */
    this.unmq.on("_updateRouter", (content, ask, payload) => {
      //拿到所有的iframe
      const iframeList = getIframeNode(true);
      //向所有iframe 同伴 发送自己的坐标
      type Message = {
        data: Coordinate;
      };
      const message: Message = {
        data: {},
      };
      iframeList.forEach(item => {
        sendMessage(item, { data: {} }, "*");
      });
      ask(true);
    });
    /**
     * 挂载消费者
     */
    for (const queueName in queueCollection) {
      if (queueCollection[queueName].ask) {
        this.unmq.on(queueName, (content, ask, payload) => {
          ask();
        });
      }
    }
  }
  private setPostMessage<E extends keyof QueueCollection>(queueName: E) {
    this.unmq.on(queueName, () => {
      //真实发送消息的
      return true;
    });
  }
  /**
   * 设置一条iframe 节点信息，
   * 给每个于交换机连接的队列绑定一个消费方法
   * @param exchangeName 交换机名称 / iframe名称
   * @param iframeNode iframe dom node
   */
  setIframe<E extends keyof ExchangeCollection>(exchangeName: E, iframeNode: Window) {
    const iframe = this.unmq.getExchange(exchangeName);
    iframe.iframeNode = iframeNode;
  }
  removeIframe<E extends keyof ExchangeCollection>(exchangeName: E) {
    const iframe = this.unmq.getExchange(exchangeName);
    iframe.iframeNode = null;
  }

  /**
   *
   *
   * @param exchangeName
   * @param contentList
   * @returns
   */
  emit<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this {
    const iframe = this.unmq.getExchange(exchangeName);
    const newsExpand = contentList.map(
      content =>
        new NewsExpand({
          content: {
            content,
            exchangeName,
            ndoeId: iframe?.ndoeId,
            origin: iframe?.origin,
            iframeNode: iframe?.iframeNode,
          },
        }),
    );
    this.unmq.pushNewsListToExchange(exchangeName, ...newsExpand);
    return this;
  }
}
