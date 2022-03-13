import UNodeMQ, { Exchange, Queue, News } from "../..";
import { ReturnPanShapeExchange } from "../../core/UNodeMQ";
import { postMessage } from "./messageProcess";
import RouteTable, { Coordinate } from "./coordinate";
import Centralization from "./coordinate/mode/Centralization";
import Decentralization from "./coordinate/mode/Decentralization";
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
type ConstructorOptionParameters<T extends new (args: any) => any> = T extends new (args: infer P) => any ? P : never;

class Iframe<D> extends Exchange<D> {}
export class SelfIframe<D> extends Iframe<D> {}
export class OtherIframe<D> extends Iframe<D> {
  constructor(option: Pick<ConstructorOptionParameters<typeof Iframe>, "name">) {
    super(option);
  }
}
export class SelfQueue<D> extends Queue<D> {}
/**
 * 扩展消息，添加交换机名称，
 */
export class NewsExpand<D, ExchangeName> extends News<D> {
  constructor(content: D) {
    super(content);
  }
}

type RouteMode = "Centralization" | "Decentralization";
/**
 * 使用postMessage api 进行通信
 *
 */
export default class IframeMessage<
  ExchangeCollection extends Record<string, OtherIframe<unknown>>,
  QueueCollection extends Record<string, SelfQueue<unknown>>,
> {
  readonly name = "postMessage";
  private unmq: UNodeMQ<ExchangeCollection, QueueCollection>;
  //接受外界消息，然后转发到 self 交换机
  private acceptMessage = new SelfQueue<unknown>();
  //接受来着外界的坐标信息 坐标信息
  private acceptCoordinate = new SelfQueue<Coordinate>();
  //路由表
  private routeTable: RouteTable;

  constructor(
    name: string,
    selfIframe: SelfIframe<unknown>,
    otherIframe: ExchangeCollection,
    selfQueue: QueueCollection,
    routeMode: RouteMode = "Decentralization",
  ) {
    //为每个交换机添加默认队列
    const queueCollection: Record<string, Queue<unknown>> = {};
    for (const name in otherIframe) {
      const queueName = name + "SendMessage";
      queueCollection[queueName] = new Queue();
      otherIframe[name].setRoutes([queueName]);
    }
    this.unmq = new UNodeMQ(
      Object.assign(otherIframe, {
        [name]: selfIframe,
      }),
      Object.assign(selfQueue, queueCollection),
    );
    //注册路由表
    if (routeMode === "Decentralization") {
      this.routeTable = new Decentralization();
    } else if (routeMode === "Centralization") {
      this.routeTable = new Centralization();
    }
    //挂载接受外界消息的消费者到_acceptMessage
    this.acceptMessage.pushConsume((content: any) => {
      this.unmq.emit(name, content);
      return true;
    });
  }
  /**
   * 发送消息给其他应用
   * @param exchangeName
   * @param contentList
   */
  emit<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]) {
    this.unmq.emit(exchangeName, ...contentList);
    //广播获取路由地址
    this.routeTable.getCoordinate(exchangeName).then((coordinate: Coordinate) => {
      //获取到路由地址以后，
      for (const content of contentList) {
        postMessage({ message: content }, coordinate);
      }
    });
  }
}
