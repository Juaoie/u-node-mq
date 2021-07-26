# u-queue

可以前端多模块通信的简易消息中心模型

## 1、为什么会有 u-node-mq？属于重复造轮子吗？

_就像[u-cache-ui](https://github.com/Juaoie/u-cache-ui)一样，u-node-mq 属于特定开发环境下才能用得上得插件_

    u-node-mq主要解决前端多模块通信问题；随着现在前端开发框架越来越多，架构设计越来越复杂，前端现在似乎更加趋向于微前端领域，即使一些中小公司用不上市面上大多数的微前端框架，但稍微大点的前端项目都已经为已有的单页面应用划分多个模块，这样的多模块视乎也是一种伪`微前端`；而在某些情况下，这些多模块通信已不能传统的通信技术了，例如：vuex、Redux或者使用事件总线等，页面间的通信技术就更加无法满足大多数场景了；

---

## 2、u-node-mq 核心概念

> u-node-mq 是由多个模块组合而成，你可以自行组合这些模块以实现不同的功能，除了主模块你必须使用以外，其他都可以根据你特定需求来组合

- `UNodeMQ` 主模块，一般一个应用只用创建一次，需要根据需求传入其他模块的实例

- `Exchange` 交换机，每个交换机就是一个分发数据到队列的路由

- `Queue` 队列，队列是一个能存储少量数据和唯一能分配数据给不同服务的模块，理论上每个队列的消息应该是相同数据类型的

- `News` 消息，消息一般不直接由用户创建，而是由 UNodeMQ 创建，除非你有持久化数据的需求，那么你可以配合`u-cache-ui api`管理和存储数据，在下次应用启动的时候初始化`news`到`queue`中

- `Consumer` 消费者，消费者一般也不直接有用户创建，而是由 UNodeMQ 创建，除非你有其他一些更加复杂的业务需求，例如：同时创建多个不同消费者，或者创建消费特定次数的消费者等

- `Logs` 日志消息，方便调试开发

---

## 3、UNodeMQ

```javascript
const uNodeMQ = new UNodeMQ(Object);
//or
const uNodeMQ = new UNodeMQ();
uNodeMQ.create(Object);
```

创建模块

**Object 参数说明**

| 名称      | 类型       | 必填 | 说明       |
| --------- | ---------- | ---- | ---------- |
| exchanges | Exchange[] | 否   | 交换机列表 |
| queues    | Queues[]   | 否   | 队列列表   |
| logs      | Logs       | 否   | 日志系统   |

**uNodeMQ 方法说明**

| 名称 | 参数     | 说明               |
| ---- | -------- | ------------------ |
| logs | Function | 返回 Logs 日志实例 |

---

## 4、Exchange

```javascript
const exchange = new Exchange(Object);
```

创建交换机

**Object 参数说明**

| 名称     | 类型     | 必填 | 说明                                     |
| -------- | -------- | ---- | ---------------------------------------- |
| name     | String   | 是   | 交换机名称                               |
| routes   | String[] | 否   | 需要匹配的队列名称                       |
| repeater | Function | 否   | 自定义路由函数，填写该参数 routes 将失效 |
| queues   | Queues[] | 否   | 队列列表                                 |

**exchange.repeater 方法参数说明**

| 参数   | 类型    | 说明                   |
| ------ | ------- | ---------------------- |
| 参数 1 | content | 此处不因该修改 content |

**exchange.repeater 方法返回值说明**

| 返回值 | 类型     | 说明                                |
| ------ | -------- | ----------------------------------- |
| 返回值 | String[] | 匹配到的队列名称列表，routes 将失效 |

**exchange 方法说明**

| 名称 | 参数 | 说明     |
| ---- | ---- | -------- |
| emit | News | 发送数据 |

---

## 5、Queue

```javascript
const queue = new Queue(Object);
```

创建队列

**Object 参数说明**

| 名称      | 类型       | 必填 | 默认     | 说明                                          |
| --------- | ---------- | ---- | -------- | --------------------------------------------- |
| name      | String     | 是   |          | 队列名称                                      |
| news      | News[]     | 否   | []       | 消息列表                                      |
| consumers | Consumer[] | 否   | []       | 消费者列表                                    |
| ask       | Boolean    | 否   | false    | 是否需要消息确认，为 true，则需要手动确认消息 |
| awaitTime | Number     | 否   | 10\*1000 | 等待消息确认的最大时长，单位为 ms             |
| type      | "Random"   | 否   | "Random" | 多个消费者的时候如何分发消息                  |

**queue 方法说明**

| 名称 | 参数     | 说明           |
| ---- | -------- | -------------- |
| push | News     | 加入数据       |
| on   | Consumer | 订阅数据       |
| off  | Consumer | 取消订阅       |
| once | Consumer | 一次性订阅数据 |

---

## 6、News

```javascript
const news = new News(Any);
```

创建消息

**news 参数说明**

| 名称       | 类型   | 说明           |
| ---------- | ------ | -------------- |
| id         | String | 消息 id        |
| createTime | Number | 消息创建时间戳 |
| content    | Any    | 消息内容       |

---

## 7、Consumer

```javascript
const consumer = new Consumer(Function);
```

创建消费者

**Function 方法说明**

| 参数   | 类型 | 说明 |
| ------ | ---- | ---- |
| 参数 1 | News |      |

**Function 返回值说明**

| 返回值 | 类型               | 说明                                       |
| ------ | ------------------ | ------------------------------------------ |
| 返回值 | Promise\<Boolean\> | ask 为 true 生效，返回 true 则表示消费成功 |

**consumer 参数说明**

| 名称       | 类型     | 说明             |
| ---------- | -------- | ---------------- |
| id         | String   | 消费者 id        |
| createTime | Number   | 消费者创建时间戳 |
| consume    | Function | 消费方法         |

---

## 8、Logs

创建日志系统

```javascript
const logs = new Logs();
```

**logs 参数说明**

| 名称            | 参数           | 说明              |
| --------------- | -------------- | ----------------- |
| allExchangelogs | ExchangeLogs[] | exchange 日志列表 |
| allQueueLogs    | QueueLogs[]    | queue 日志        |
| allNewsLogs     | NewsLogs[]     | news 日志         |
| allConsumerLogs | ConsumerLogs[] | consumer 日志     |

**logs 方法说明**

| 名称               | 参数 | 返回值         | 说明                   |
| ------------------ | ---- | -------------- | ---------------------- |
| clear              |      | Boolean        | 清空所有日志           |
| getAllExchangeLogs |      | ExchangeLogs[] | 获取所有 exchange 日志 |
| getAllQueueLogs    |      | QueueLogs[]    | 获取所有 queue 日志    |
| getAllNewsLogs     |      | NewsLogs[]     | 获取所有 news 日志     |
| getAllConsumerLogs |      | ConsumerLogs[] | 获取所有 consumer 日志 |

---

## 9、ExchangeLogs

创建交换机消息日志

```javascript
const exchangeLogs = new ExchangeLogs(Object);
```

**Object 参数说明**

| 名称          | 类型     | 说明               |
| ------------- | -------- | ------------------ |
| name          | String   | 交换机名称         |
| id            | String   | 交换机 id          |
| emitNum       | Number   | emit 成功数量      |
| dispenseNum   | Number   | 数据分配成功数量   |
| queueIdList   | String[] | 消息队列 id 的数量 |
| queueNameList | String[] | 消息队列名称列表   |
| queueNum      | Number   | 消息队列数量       |

---

## 10、QueueLogs

创建消息队列日志

```javascript
const queueLogs = new QueueLogs();
```

**queueLogs 参数说明**

| 名称            | 类型     | 说明                                     |
| --------------- | -------- | ---------------------------------------- |
| name            | String   | 队列名称                                 |
| id              | String   | 队列 id                                  |
| ask             | Boolean  | 是否需要消息确认                         |
| awaitTimeFormat | Number   | 等待消息确认的最大时长，ask 为 true 才有 |
| type            | "random" | 多个消费者的时候如何分发消息             |
| newsIdList      | String[] | 队列内消息 id 列表                       |
| newsNum         | Number   | 队列内消息数量                           |
| allNewsNum      | Number   | 队列内所有消息数量（包括已消费的）       |
| consumerIdList  | String[] | 队列消费者 id 列表                       |
| consumerNum     | Number   | 队列消费者者数量                         |
| allConsumerNum  | Number   | 队列内所有消费者数量（包括已取消的）     |

## 11、NewsLogs

创建消息日志

```javascript
const newsLogs = new NewsLogs();
```

**newsLogs 参数说明**

| 名称                 | 类型   | 说明         |
| -------------------- | ------ | ------------ |
| id                   | String | 消息 id      |
| createTimeFormat     | String | 消息创建时间 |
| destroyTimeFormat    | String | 消息销毁时间 |
| size                 | String | 消息大小     |
| readNum              | Number | 读取次数     |
| latestReadTimeFormat | String | 最近读取时间 |

## 12、ConsumerLogs

创建消费者日志

```javascript
const consumerLogs = new ConsumerLogs();
```

**consumerLogs 参数说明**

| 名称                    | 类型   | 说明           |
| ----------------------- | ------ | -------------- |
| id                      | String | 消费者 id      |
| createTimeFormat        | String | 消费者创建时间 |
| destroyTimeFormat       | String | 消息销毁时间   |
| consumeNum              | Number | 消费次数       |
| latestConsumeTimeFormat | String | 最近消费时间   |
