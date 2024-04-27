import { Option, defaultOption, LOG_LEVEL, OUTPUT_TYPE } from "./config";
import { getUUID } from "@/utils/tools";
import { onListener } from "./listener";
import UNodeMQ, { Exchange, Queue } from "@/index";
import { wxApi } from "./proxyApi";

function proxyConsle(this: WxLogsPlugin, content: Message) {
  console.log("----consle 日志---");
  console[content.type](content);
}

function proxyRealtime(this: WxLogsPlugin, content: Message) {
  console.log("----realtime 日志---");
  this.addRealtimeLog(content.type, content);
}

function proxyRequest(this: WxLogsPlugin, content: Message) {
  console.log("----request 日志---");
  console.log(content);
}

const ProxyList = {
  [OUTPUT_TYPE.Console]: proxyConsle,
  [OUTPUT_TYPE.Realtime]: proxyRealtime,
  [OUTPUT_TYPE.Request]: proxyRequest,
};

function getMiniprogramInfo() {
  return {
    windowInfo: wxApi("getWindowInfo")?.(),
    skylineInfoSync: wxApi("getSkylineInfoSync")?.(),
    deviceInfo: wxApi("getDeviceInfo")?.(),
    appBaseInfo: wxApi("getAppBaseInfo")?.(),
    appAuthorizeSetting: wxApi("getAppAuthorizeSetting")?.(),
    launchOptionsSync: wxApi("getLaunchOptionsSync")?.(),
    apiCategory: wxApi("getApiCategory")?.(),
  };
}
type Message = {
  type: LOG_LEVEL;
  uuid: string;
  content?: unknown;
};
/**
 * 微信小程序日志监控
 */
export default class WxLogsPlugin {
  private unmq: UNodeMQ<Message, Record<LOG_LEVEL, Exchange<Message>>, Record<OUTPUT_TYPE, Queue<Message>>> | null = null;
  /**
   * 实时日志
   * 

  注意事项
    由于后台资源限制，“实时日志”使用规则如下：

    为了定位问题方便，日志是按页面划分的，某一个页面，在一定时间内（最短为5秒，最长为页面从显示到隐藏的时间间隔）打的日志，会聚合成一条日志上报，并且在小程序管理后台上可以根据页面路径搜索出该条日志。
    每个小程序账号，We分析基础版每天限制5000条日志，We分析专业版为50000条，且支持购买配置升级或购买额外的上报扩充包。日志根据版本配置，会保留7天/14天/30天不等，建议遇到问题及时定位。
    一条日志的上限是5KB，最多包含200次打印日志函数调用（info、warn、error调用都算），所以要谨慎打日志，避免在循环里面调用打日志接口，避免直接重写console.log的方式打日志。
    意见反馈里面的日志，可根据OpenID搜索日志。
    setFilterMsg和addFilterMsg 可设置类似日志tag的过滤字段。如需添加多个关键字，建议使用addFilterMsg。例如addFilterMsg('scene1'), addFilterMsg('scene2'),addFilterMsg('scene3')，设置后在小程序管理后台可随机组合三个关键字进行检索，如：“scene1 scene2 scene3”、“scene1 scene2”、 “scene1 scene3” 或 “scene2”等（以空格分隔，故addFilterMsg不能带空格）。以上几种检索方法均可检索到该条日志，检索条件越多越精准。
    目前为了方便做日志分析，插件端实时日志只支持 key-value 格式。
    实时日志目前只支持在手机端测试。工具端的接口可以调用，但不会上报到后台。
    开发版、体验版的实时日志，不计入相关quota，即无使用上限。

   */
  private readonly realtimeLog = wxApi("getRealtimeLogManager")?.();
  /**
   * 初始化获取当前系统信息
   */
  private readonly systemInfo = getMiniprogramInfo();
  /**
   * uuid
   */
  private readonly uuid = getUUID();
  /**
   *
   * @param option
   */
  constructor(private readonly option: Option = defaultOption) {}
  /**
   *
   * @param unmq
   */
  install(unmq: UNodeMQ<Message, Record<LOG_LEVEL, Exchange<Message>>, Record<OUTPUT_TYPE, Queue<Message>>>) {
    //
    /**
     * 初始化交换机
     */
    Object.entries(LOG_LEVEL).forEach(([, value]) => {
      unmq.addExchage(value, new Exchange<Message>());
    });

    /**
     * 初始化队列
     */
    Object.entries(OUTPUT_TYPE).forEach(([, value]) => {
      unmq.addQueue(value, new Queue<Message>());
    });

    /**
     * 设置交换机路由
     */
    Object.entries(this.option).forEach(item => {
      const e = unmq.getExchange(item[0] as LOG_LEVEL);
      if (e === null) return e;
      e.setRoutes(item[1]);
    });

    /**
     * 添加默认的监听器
     */
    Object.values(OUTPUT_TYPE).forEach(item => {
      unmq.on(item, ProxyList[item].bind(this));
    });

    this.unmq = unmq;

    onListener.apply(this);

    this[LOG_LEVEL.Warn](this.systemInfo);
  }
  /**
   *  添加日志到实时日志
   * @param logType
   * @param msg
   */
  addRealtimeLog(logType: LOG_LEVEL, msg: Message) {
    this.realtimeLog?.[logType](msg);
  }

  [LOG_LEVEL.Info](content: unknown) {
    if (this.unmq === null) return false;
    this.unmq.emit(LOG_LEVEL.Info, {
      type: LOG_LEVEL.Info,
      uuid: this.uuid,
      content,
    });
    return true;
  }
  [LOG_LEVEL.Warn](content: unknown) {
    if (this.unmq === null) return false;
    this.unmq.emit(LOG_LEVEL.Warn, {
      type: LOG_LEVEL.Warn,
      uuid: this.uuid,
      content,
    });
    return true;
  }
  [LOG_LEVEL.Error](content: unknown) {
    if (this.unmq === null) return false;
    this.unmq.emit(LOG_LEVEL.Error, {
      type: LOG_LEVEL.Error,
      uuid: this.uuid,
      content,
    });
    return true;
  }
}
