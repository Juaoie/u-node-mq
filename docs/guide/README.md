# 介绍

u-node-mq 是一个代理消息的消息中心模型，以下简称为 unmq，可以解决多模块异步通信问题。基于 unmq 五个基本组件可开发功能丰富的插件，例如内置的流程控制等，下面将简单介绍五个组件基础功能

[npmjs 地址](https://www.npmjs.com/package/u-node-mq)

[github 地址](https://github.com/Juaoie/u-node-mq)

[文档地址](https://juaoie.github.io/u-node-mq/)

## 基础组件

组合使用基础组件可实现类似于[RabbitMQ](https://www.rabbitmq.com)的功能，[RabbitMQ 的六个模式图](https://www.rabbitmq.com/getstarted.html)详解了基础组件的功能;

搭配插件功能使用基础组件也将可以实现 Rxjs 的类似功能，rxjs 强大的功能是通过管道(pipeline)对异步消息数据的处理，如[rxmarbles 的弹珠图](https://rxmarbles.com/)实例方法；

· [交换机（Exchange）](/guide/basic-components.md#交换机)

· [队列（Queue）](/guide/basic-components.md#队列)

· [消息（News）](/guide/basic-components.md#消息)

· [消费者（Consumer）](/guide/basic-components.md#消费者)

· [日志（Logs）](/guide/basic-components.md#日志)

## Plugin

· [流程控制器（Process）]()
