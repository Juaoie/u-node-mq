import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { PROJECT_URL, CHAT_MIN_SERVICE } from "./path";
//postCode端口解决了跨域问题
const MQTT_USERNAME = "postCodeAdmin"; //
const MQTT_PASSWORD = "123456"; //
const MQTT_TOPIC = "/queue/"; // 模式/队列名

function client(errorCallBack) {
  return new Promise((resolve, reject) => {
    const socket = new SockJS(PROJECT_URL + CHAT_MIN_SERVICE + "/ws");
    const client = Stomp.over(socket); //创建一个连接对象
    client.heartbeat.outgoing = 5000; //心跳请求发送频率
    client.heartbeat.incoming = 5000; //心跳请求接受频率
    client.debug = null; //关闭控制台输出数据
    // 建立连接
    client.connect(
      { login: MQTT_USERNAME, passcode: MQTT_PASSWORD },
      frame => resolve(client),
      error => {
        client.disconnect();
        errorCallBack();
        reject(error);
      },
    );
  });
}

function subscribe(client, _this) {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  if (!userInfo) return;
  // 订阅频道，建立长连接
  client.subscribe(
    MQTT_TOPIC + userInfo.userId,
    res => {
      _this.$root.$emit("subscribeCallBack", res);
    },
    {}, //header信息
  );
}

export default {
  install: function (Vue) {
    Vue.prototype.$client = errorCallBack => client(errorCallBack);
    Vue.prototype.$subscribe = (client, _this) => subscribe(client, _this);
  },
};
