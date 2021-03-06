# 导航预览

## 基础组件和工作原理

开发者需要先了解`u-node-mq`中的五大基础组件和工作原理，了解工作原理是灵活使用此工具的关键；

[点击跳转组件介绍](./internal/index.md)

## 使用方法

通过对基础组件的封装能够让开发者快速实现需求功能；

如果需要一些更加灵活的使用操作，也可以单独去组合组件去实现；

[点击跳转快速开发介绍](./unmq.md)

## 插件功能

插件是扩展或者集成`UNodeMQ`类的组件，例如`IframePlugin`实际是集成`UNodeMQ`类的发布订阅模型的工具，所以这里的插件理解为可以快速集成发布订阅模型的工具；

[点击跳转插件功能](./plugins/index.md)

## 管道符操作方法

管道符操作方法实际是对队列中的数据进行操作的方法，在消息进入队列和被弹出队列中的生命周期过程中对消息数据进行处理，一些同步操作和异步操作的生命周期极便利的扩展操作符的可操作空间，内置的操作符集合提供了大多数常见的对消息数据进行操作的方法；

## 其他示例

更多简单示例代码可以在`jest`的测试方法中找到
