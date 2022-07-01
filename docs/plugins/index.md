<h1 id="plugins">💨 plugins</h1>

    `u-node-mq`提供一些内置插件，用来解决前端开发场景下异步通信问题，也可以由开发者自行开发插件进行集成；

## Plugin

开发插件

```javascript
import UNodeMQ, { PluginInstallFunction } from "u-node-mq";

const plugin: PluginInstallFunction = (unmq: UNodeMQ) => {
  //插件功能
};

//or

const plugin: { install: PluginInstallFunction } = {
  install: (unmq: UNodeMQ) => {
    //插件功能
  },
};
```

使用插件

```javascript
import UNodeMQ from "u-node-mq";
import plugin from "u-node-mq/plugins/plugin";

const unmq = new UNodeMQ(ExchangeCollection, QueueCollection);
unmq.use(plugin);
```

## [IframePlugin](./IframePlugin.md)
