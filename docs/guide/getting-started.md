# 快速上手

简单介绍安装和使用方法

## 安装

使用以下方法安装

```javascript
yarn add u-node-mq  //推荐
```

or

```javascript
npm install u-node-mq
```

## 基础使用方法介绍

创建一个实例

```javascript
// main.js 文件

import UNodeMQ from "u-node-mq";

//写入一个交换机名称，选填队列名称
const unmq = new UNodeMQ({ exchangeName: "EXCHANGE_NAME", queueNameList: ["QUEUE1", "QUEUE2"] });

//配置路由或者路由中继器，分配消息到指定的队列
unmq.exchange.routes = ["QUEUE1", "QUEUE2"];

export unmq
```

发送消息

```javascript
// send.js 文件

import { unmq } from "main.js";

//发送消息的方法
function send() {
  unmq.emit("消息1", "消息2");
}
```

消费消息

```javascript
//consume.js 文件
import { unmq } from "main.js";

//创建消费者绑定到队列
unmq.on("QUEUE1", this.news);

function consume(news) {
  console.log(`消息内容：${news}`);
}
```

## UNodeMQ

创建实例，同时需要指定 [routes](/guide/basic-components.md#交换机) 或者 [repeater](/guide/basic-components.md#交换机)

`new UNodeMQ<D>({ exchangeName: "EXCHANGE_NAME", queueNameList: ["QUEUE1", "QUEUE2"] })`

也可以手动创建队列，设置队列属性，可配置是否需要消息确认，和失败后重新消费次数

`new Queue({name:"QUEUE1",ask:true})`

ts 可指定消息数据类型，下面消息数据类型用 D 表示；

## emit

- 参数

  - `{D} news`
  - `{D} news`
  - `... {D} news`

- 返回值

  - `this`

- 用法

发送消息给队列，支持同时发送多条消息

## on

- 参数

  - `{string} queueName`
  - `{function} consume`
  - `{any} payload`

- 返回值

  - `{function} off`

- 用法

指定消费者订阅的队列，传入消费方法和固定参数载体；消息内容和 next 方法以及载体会传给消费方法（如果需要消息确认或者存在载体的情况下）

也可在订阅队列后使用链式调用立即移除消费者


## off

- 参数

  - `{string} queueName`
  - `{function} consume`

- 返回值

  - `this`

- 用法

移除指定队列上的消费者，如果消费者不存在，会打印日志，正常返回this

## once

- 参数

  - `{string} queueName`
  - `{function} consume`
  - `{any} payload`

- 返回值

  - `this`

- 用法

与on方法类似，不同的是消费一条消息后将自动移除消费者

## `on()()` 和 `once()` 方法的区别

`on()()` 

立即消费指定队列中的所有消息，不管队列中有没有消息，消费结束就会移除消费者；

`once()`

等待指定队列中至少有一条消息才开始消费，并且只消费一条消息，有且仅当消费了一条消息后消费者才被移除；
