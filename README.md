- [💠 简介](#introduction)
- [✨ u-node-mq 基本使用方法](#u-node-mq)
- [💨 plugins](#plugins)
  - [🐡 IframeMessage](#IframeMessage)
- [🎨 operators](#operators)
  - [🌞 map](#map)
  - [🏆 task](#task)
  - [🚴 debounceTime](#🚴debounceTime-防抖功能)
  - [🎾 throttleTime](#throttleTime)

<!-- https://duotones.co/ -->
<p align="center">
  <a href="https://github.com/Juaoie/u-node-mq" style="margin-right:20px"><img src="https://img.shields.io/github/stars/Juaoie/u-node-mq?labelColor=11245E&color=DC4379&logo=github" alt="Stars"></a>
  <a href="https://github.com/Juaoie/u-node-mq" style="margin-right:20px"><img src="https://img.shields.io/github/forks/Juaoie/u-node-mq?labelColor=290900&color=FFEFB3&logo=github" alt="Forks"></a>
   <a href="https://github.com/Juaoie/u-node-mq" style="margin-right:20px"><img src="https://img.shields.io/github/languages/code-size/Juaoie/u-node-mq?labelColor=682218&color=F8BE3D&logo=github" alt="Size"></a>
  <a href="https://github.com/Juaoie/u-node-mq" style="margin-right:20px"><img src="https://img.shields.io/npm/v/u-node-mq?labelColor=00007E&color=6AFF7F&logo=npm" alt="Version"></a>
  <a href="https://github.com/Juaoie/u-node-mq" style="margin-right:20px"><img src="https://img.shields.io/github/languages/top/Juaoie/u-node-mq?labelColor=01AB6D&color=FBF019&logo=TypeScript&logoColor=FDD9E2" alt="Languages"></a>
  <a href="https://github.com/Juaoie/u-node-mq" style="margin-right:20px"><img src="https://img.shields.io/github/license/Juaoie/u-node-mq?labelColor=7F01D3&color=01DBFE" alt="Count"></a>
</p>

<h1 id="introduction">💠 简介</h1>

    基于发布订阅模型的消息通信工具，解决模块异步通信功能，有完整的 ts 类型提示和丰富的扩展插件；

## npm 安装

`yarn add u-node-mq`

or

`npm install u-node-mq`

<h1 id="u-node-mq">✨ u-node-mq 基本使用方法</h1>

**main.js**

```javascript
import UNodeMQ, { Exchange, Queue } from "u-node-mq";

//声明交换机ex1和交换机ex2，以及队列qu1
const unmq = new UNodeMQ({ ex1: new Exchange({ routes: ["qu1"] }) }, { qu1: new Queue() });

export default unmq;

//可以挂到抬手就摸得到的位置

// Vue.prototype.unmq = unmq;  //(Vue 2.x)

// const app = createApp({})
// app.config.globalProperties.unmq = unmq     //(Vue 3.x)
```

**页面 1.js**

```javascript
import unmq from "main.js";

//发送数据
unmq.emit("ex1", "消息内容1", "消息内容2");
```

**页面 2.js**

```javascript
import unmq from "main.js";

//接收并消费数据
unmq.on("qu1", getData);

function getData(data) {
  console.log(data);
}
```

## u-node-mq 核心概念

> u-node-mq 是由多个模块组合而成，你可以自行组合这些模块以实现不同的功能，可以根据你特定需求来组合

- `UNodeMQ` 主模块，一般一个应用只用创建一次，需要根据需求传入其他模块的实例

- `Exchange` 交换机，每个交换机就是一个分发数据到队列的路由

- `Queue` 队列，队列是一个能存储少量数据和唯一能分配数据给不同服务的模块，理论上每个队列的消息应该是相同数据类型的

- `News` 消息，消息一般不直接由用户创建，而是由 UNodeMQ 创建，除非你有持久化数据的需求，那么你可以配合`u-cache-ui api`管理和存储数据，在下次应用启动的时候初始化`news`到`queue`中

- `Consumer` 消费者，消费者一般也不直接由用户创建，而是由 UNodeMQ 创建，除非你有其他一些更加复杂的业务需求，例如：同时创建多个不同消费者，或者创建消费特定次数的消费者等

- `Logs` 日志消息，方便调试开发

## 1、UNodeMQ

```javascript
import UNodeMQ from "u-node-mq";
const unmq = new UNodeMQ(ExchangeCollection, QueueCollection);
```

创建模块

**UNodeMQ constructor 参数说明**

| 名称               | 类型                  | 必填 | 说明       |
| ------------------ | --------------------- | ---- | ---------- |
| ExchangeCollection | { string : Exchange } | 是   | 交换机集合 |
| QueueCollection    | { string : Queue }    | 是   | 队列集合   |

**unmq 方法说明**

| 名称        | 参数类型                           | 说明                                                           |
| ----------- | ---------------------------------- | -------------------------------------------------------------- |
| emit        | (ExchangeName , ...消息)           | 发送数据到交换机，返回 this                                    |
| emitToQueue | (QueueName , ...消息)              | 发送数据到交换机，返回 this                                    |
| on          | (QueueName , 消费方法 , ?载荷消息) | 订阅队列消息，载荷信息每次都会发送给消费者，返回取消订阅的函数 |
| off         | (QueueName , ?消费方法)            | 移除队列上的指定消费者或者移除队列上所有消费者，返回 this      |
| once        | (QueueName , 消费方法 , ?载荷消息) | 只消费一条消息，返回 this                                      |
| 更多        | 未知                               | 更多的内部方法                                                 |

## 2、Exchange

```javascript
const exchange = new Exchange(Option);
```

创建交换机

**Option 参数说明**

| 名称     | 类型     | 必填 | 说明                                     |
| -------- | -------- | ---- | ---------------------------------------- |
| name     | String   | 否   | 交换机名称                               |
| routes   | String[] | 否   | 需要匹配的队列名称                       |
| repeater | Function | 否   | 自定义路由函数，填写该参数 routes 将失效 |

## 3、Queue

```javascript
const queue = new Option(Option);
```

创建队列

**Option 参数说明**

| 名称    | 类型              | 必填 | 默认     | 说明                                                                        |
| ------- | ----------------- | ---- | -------- | --------------------------------------------------------------------------- |
| name    | String            | 否   |          | 队列名称                                                                    |
| mode    | "Random" \| "All" | 否   | "Random" | 消费模式，Random 代表随机抽取一个消费者消费，ALL 代表所有消费者都会消费消息 |
| ask     | Boolean           | 否   | false    | 是否需要消息确认，为 true，则需要手动确认消息                               |
| rcn     | Number            | 否   | 3        | 消费失败后可重复消费次数                                                    |
| async   | Boolean           | 否   | false    | 是否是异步队列，为 false 则会一条消息消费完成或者失败才会消费下一条消息     |
| maxTime | Number            | 否   | 3000     | 最长消费时长，单位毫秒，小于 0 代表不限时长                                 |

## 4、News

```javascript
const news = new News(Any);
```

创建消息

**news 属性说明**

| 名称          | 类型   | 说明               |
| ------------- | ------ | ------------------ |
| createTime    | Number | 消息创建时间戳     |
| content       | Any    | 消息内容           |
| consumedTimes | number | 剩余可重复消费次数 |

## 5、Consumer

```javascript
const consumer = new Consumer(Consume, PayLoad);
```

创建消费者

**Consume 参数说明**

| 参数   | 类型     | 说明                                                            |
| ------ | -------- | --------------------------------------------------------------- |
| 参数 1 | 消息内容 |                                                                 |
| 参数 2 | next     | 是否确认消费，执行 next 默认为确认消费，传 false 则代表消费失败 |
| 参数 3 | payload  | 固定消费内容，每次消费都会传递                                  |

**consumer 属性说明**

| 名称       | 类型     | 说明             |
| ---------- | -------- | ---------------- |
| createTime | Number   | 消费者创建时间戳 |
| consume    | Function | 消费方法         |
| payload    | any      | 固定载荷         |

<h1 id="plugins">💨plugins</h1>

    u-node-mq提供一些内置插件，用来解决复杂场景下异步通信问题；

<h2 id="IframeMessage">🐡IframeMessage</h2>

- IframeMessage 是用来解决同一个 tabs 下 iframe 通信的 u-node-mq 插件；
- u-node-mq 集成 IframeMessage 以后，unmq 的每个 Exchange 将对应一个 iframe 容器，且非当前容器的 Exchange 路由和中继器将会被重写；
- 一个 iframe 应用一般情况下应该只注册一个 IframeMessage 插件；
- 被集成了 IframeMessage 插件的 unmq，开发者只需要维护自己 Exchange 下的队列；
- 可以在其他 Exchange 应用上添加 origin 用来验证 iframe 的 url

## IframeMessage 基本使用方法

**iframe1 应用**

```javascript
// https://iframeName1.com
import IframeMessage from "u-node-mq/plugins/iframe";
import UNodeMQ from "u-node-mq";
const unmq = new UNodeMQ(
  {
    iframeName1: new Exchange({ routes: ["qu1"] }),
    iframeName2: new Exchange({ origin: "https://iframeName2.com" }),
  },
  {
    qu1: new Queue(),
  }
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
  }
);
unmq.use(new IframeMessage("iframeName2"));
unmq.on("qu2", (res) => {
  console.log("接受来自其他iframe容器的消息", res);
});
```

<h1 id="operators">🎨operators</h1>

    Queue类提供的钩子函数可以集成operators对数据和消费者进行操作

<h2 id="map">🌞map 对队列消息进行映射 </h2>

```javascript
import UNodeMQ, { Exchange, Queue, ConsumMode, createQuickUnmq, map } from "u-node-mq";

const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
  qu1: new Queue<number>()
    .add(map((value, index) => value * 10)),
});
```

<h2 id="task">🏆task 设置队列能加入消息的数量 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
  qu1: new Queue<number>()
    .add(task(2)),
});
```

<h2 id="debounceTime">🚴debounceTime 防抖功能 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
  qu1: new Queue<number>()
    .add(debounceTime(1000, true)),
});
```

<h2 id="throttleTime">🎾throttleTime 节流功能 </h2>

```javascript
const quickUnmq = createQuickUnmq(new Exchange<number>({ routes: ["qu1"] }), {
  qu1: new Queue<number>()
    .add(throttleTime(1000, true)),
});
```
