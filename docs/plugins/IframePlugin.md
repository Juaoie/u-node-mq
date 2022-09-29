# IframeMessage

- `IframeMessage` 是用来解决同一个 `tabs` 下 `iframe` 通信的 `u-node-mq` 插件；
- `u-node-mq` 集成 `IframeMessage` 以后，`unmq` 的每个 `Exchange` 将对应一个 `iframe` 容器，且非当前容器的 `Exchange` 路由和中继器将会被重写；
- 一个 `iframe` 应用一般情况下应该只注册一个 IframeMessage 插件；
- 被集成了 `IframeMessage` 插件的 `unmq`，开发者只需要维护自己 `Exchange` 下的队列；
- 可以在其他 `Exchange` 应用上添加 `origin` 用来验证 `iframe` 的 `url`

## IframeMessage 基本使用方法

**iframe1 应用**

```javascript
// https://iframeName1.com
import IframeMessage from "u-node-mq/plugins/iframe";
import UNodeMQ from "u-node-mq";
const unmq = new UNodeMQ(
  {
    iframeName1: new Exchange({ routes: ["qu1"] }),
    //约束iframeName2的origin必须为https://iframeName2.com
    iframeName2: new Exchange({ origin: "https://iframeName2.com" }),
  },
  {
    qu1: new Queue(),
  },
);
unmq.use(new IframeMessage("iframeName1"));
unmq.emit("iframeName2", "发送给iframeName2的消息");
```

**iframe2 应用**

```javascript
// https://iframeName2.com
import IframeMessage from "u-node-mq/plugins/iframe";
import UNodeMQ from "u-node-mq";
const unmq = new UNodeMQ(
  {
    iframeName1: new Exchange(),
    iframeName2: new Exchange({ routes: ["qu2"] }),
  },
  {
    qu2: new Queue(),
  },
);
unmq.use(new IframeMessage("iframeName2"));
unmq.on("qu2", res => {
  console.log("接受来自其他iframe容器的消息", res);
});
```
