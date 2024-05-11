# 插件介绍

    `u-node-mq`提供一些内置插件，用来解决前端开发场景下异步通信问题，也可以由开发者自行开发插件进行集成；

## Plugin


在您准备集成插件之前，请确保对UNodeMQ的工作流程有深入的了解。我们假设您对UNodeMQ的工作流程已经非常熟悉。

如果您已经多次使用过UNodeMQ类及其相关功能，您可能已经意识到，实际上UNodeMQ、QuickUNodeMQ和SingleUNodeMQ在应用中是与业务逻辑无关的，它们是独立于业务流程运行的。这种设计带来许多优点，例如易于扩展、跨平台兼容性和降低代码耦合度。

插件的出现是因为在某些情况下，将功能与业务逻辑结合使用能够更好地扩展功能。因此，通常情况下，每个UNodeMQ只能集成一个插件。由于插件引入了业务逻辑，它改变了UNodeMQ每个组件的本质，使每个组件能够模拟业务中的实际元素。您可以通过点击下面的链接，进入每个插件的介绍页面，了解它们与业务的对应关系。


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
import UNodeMQ,{plugin} from "u-node-mq";

const unmq = new UNodeMQ(ExchangeCollection, QueueCollection);
unmq.use(plugin);
```


## [【IframePlugin】一个跨iframe通信的插件](./IframePlugin.md)

## [【WxLogsPlugin】一个微信小程序日志插件](./WxLogsPlugin.md)
