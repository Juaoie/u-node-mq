import UNodeMQ, { Exchange, Queue, News } from "../..";
import { ReturnPanShapeExchange } from "../../core/UNodeMQ";
import { Option } from "../../internal/Exchange";
/**
 * postmessage 功能如下
 * 一、父通过contentWindow.postmessage 发送数据给指定的url 或者 *
 * contentWindow的为iframe实例对象，获取方式
 * 1.通过onload或者getElementById查询获取
 * 2.通过对window下属性直接引用获取，（一个窗口下所有直接子iframe都会挂载在window窗口下，所以iframe 实例是嵌套的）
 * 3.通过window.open打开窗口获取
 * 二、子通过window.top.postmessage 直接发送数据到夫，
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
  iframeNode: Window = null;
  constructor(option?: Option<D> & { iframeNode?: Window }) {
    super(option);
    this.iframeNode = option.iframeNode;
  }
}
export class QueueExpand<D> extends Queue<D> {}
/**
 * 扩展消息，添加交换机名称，
 */
export class NewsExpand<D, ExchangeName> extends News<D> {
  exchangeName: ExchangeName;
  constructor(exchangeName: ExchangeName, content: D) {
    super(content);
    this.exchangeName = exchangeName;
  }
}

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
     * 为当前域创建一个iframe 用于接受消息
     */
    type SelfIframe = {
      _selfIframe: Iframe<unknown>;
    };

    this.unmq = new UNodeMQ<ExchangeCollection & SelfIframe, QueueCollection>(
      Object.assign(exchangeCollection, {
        _selfIframe: new Iframe<unknown>(),
      }),
      queueCollection,
    );
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
    const newsExpand = contentList.map(content => new NewsExpand(exchangeName, content));
    this.unmq.pushNewsListToExchange(exchangeName, ...newsExpand);
    return this;
  }
}
