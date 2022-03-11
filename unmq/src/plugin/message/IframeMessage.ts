import UNodeMQ, { Exchange, Queue, News } from "../..";
import { ReturnPanShapeExchange } from "../../core/UNodeMQ";
import { Option } from "../../internal/Exchange";
import { getAllIframeDoc, getIframeNode } from "./loader";
import { sendMessage } from "./sendMessage";
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
 * 每个IframeMessage维护一张路由表
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
export class Iframe<D> extends Exchange<D> {
  constructor(option?: Option<D>) {
    super(option);
  }
}
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
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
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
    type Internalframe = {
      //自己的交换机，用于接受外边数据
      _selfIframe: Iframe<unknown>;
      //基座的交换机，用于发送数据给基座
      _masterIframe: Iframe<unknown>;
    };

    this.unmq = new UNodeMQ<ExchangeCollection & Internalframe, QueueCollection & InternalQueue>(
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
      type Message={
        data:Coordinate
        
      }
      const message:Message={
        data:{

        }
      }
      iframeList.forEach(item => {
        sendMessage(item,{data:{}} , "*");
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
