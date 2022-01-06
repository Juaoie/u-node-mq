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
