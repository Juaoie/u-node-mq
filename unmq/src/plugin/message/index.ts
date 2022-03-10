import UNodeMQ, { Exchange, Queue } from "../..";
import { ReturnPanShapeExchange } from "../../core/UNodeMQ";
import { ref } from "vue";
class Iframe<D> extends Exchange<D> {
  iframeNode: Window;
}
class QueueNews<D> extends Queue<D> {
  consumeNews() {}
}

/**
 * 使用postMessage api 进行通信
 *
 */
export default class IframeMessage<
  ExchangeCollection extends Record<string, Iframe<unknown>>,
  QueueCollection extends Record<string, QueueNews<unknown>>,
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
    // iframeWindow.postMessage();
  }
  /**
   * 设置一条iframe 节点信息，
   * @param e 交换机名称 / iframe名称
   * @param w iframe dom node
   */
  setIframe<E extends keyof ExchangeCollection>(exchangeName: E, iframeNode: Window) {
    const iframe = this.unmq.getExchange(exchangeName);
    iframe.iframeNode = iframeNode;
  }

  /**
   *
   *
   * @param exchangeName
   * @param contentList
   * @returns
   */
  emit<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this {
    return this;
  }
}
