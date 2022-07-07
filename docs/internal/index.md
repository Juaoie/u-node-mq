# 工作原理

下面是一张工作原理的简图；

<img src="./internal.png" />

## 五大基础组件

- `Exchange` 交换机，每个交换机就是一个分发数据到队列的路由；

- `Queue` 队列，队列是一个能存储数据和配合 operators 处理数据的组件，丰富的配置和管道操作符可以实现更复杂的功能；

- `News` 消息，存储内容的组件；

- `Consumer` 消费者，处理消息的业务逻辑代码；

- `Logs` 日志消息，方便调试开发，也可将日志发送到服务器；

## 1、Exchange

```javascript
const exchange = new Exchange(Option);
```

创建交换机

**Option 参数说明**

| 名称     | 类型     | 必填 | 说明                                     |
| -------- | -------- | ---- | ---------------------------------------- |
| name     | string   | 否   | 交换机名称                               |
| routes   | string[] | 否   | 需要匹配的队列名称                       |
| repeater | Function | 否   | 自定义路由函数，填写该参数 routes 将失效 |

## 2、Queue

```javascript
const queue = new Option(Option);
```

创建队列

**Option 参数说明**

| 名称    | 类型              | 必填 | 默认  | 说明                                                                        |
| ------- | ----------------- | ---- | ----- | --------------------------------------------------------------------------- |
| name    | string            | 否   |       | 队列名称                                                                    |
| mode    | "Random" \| "All" | 否   | "All" | 消费模式，Random 代表随机抽取一个消费者消费，All 代表所有消费者都会消费消息 |
| ask     | boolean           | 否   | false | 是否需要消息确认，为 true，则需要手动确认消息                               |
| rcn     | number            | 否   | 3     | 消费失败后可重复消费次数                                                    |
| async   | noolean           | 否   | false | 是否是异步队列，为 false 则会一条消息消费完成或者失败才会消费下一条消息     |
| maxTime | number            | 否   | 3000  | 最长消费时长，单位毫秒，小于 0 代表不限时长                                 |

## 3、News

```javascript
const news = new News(Any);
```

创建消息

**news 属性说明**

| 名称          | 类型   | 说明               |
| ------------- | ------ | ------------------ |
| createTime    | number | 消息创建时间戳     |
| content       | Any    | 消息内容           |
| consumedTimes | number | 剩余可重复消费次数 |

## 4、Consumer

```javascript
const consumer = new Consumer(Consume, PayLoad);
```

创建消费者

**Consume 参数说明**

| 参数   | 类型    | 说明                                                            |
| ------ | ------- | --------------------------------------------------------------- |
| 参数 1 | D       | 消息内容                                                        |
| 参数 2 | next    | 是否确认消费，执行 next 默认为确认消费，传 false 则代表消费失败 |
| 参数 3 | payload | 固定消费内容，每次消费都会传递                                  |

**consumer 属性说明**

| 名称       | 类型     | 说明             |
| ---------- | -------- | ---------------- |
| createTime | number   | 消费者创建时间戳 |
| consume    | Function | 消费方法         |
| payload    | any      | 固定载荷         |

## 5、Logs

Logs 是一个不可实例化的静态类，开发者可以使用`setLogsConfig`对日志输出进行配置；

```javascript
import { Logs } from "u-node-mq";
Logs.setLogsConfig(LogsConfig);
```

**LogsConfig 对象说明**

| 参数           | 类型            | 默认值                                    | 说明                                                                  |
| -------------- | --------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| logs           | boolean         | false                                     | 控制是否输出日志                                                      |
| types          | LogsType[]      | ["console"]                               | LogsType 为 "custom" 或者 "console"                                   |
| logsComponents | LogsComponent[] | ["Exchange", "Queue", "News", "Consumer"] | 需要输出日志的组件                                                    |
| customFunction | Function        | CustomLogFunction                         | 需要自定义处理日志的功能函数                                          |
| include        | string[]        | []                                        | 包含要输出 Exchange 和 Queue 日志的 name ，为空数组代表包含所有组件   |
| exclude        | string[]        | []                                        | 过滤要输出 Exchange 和 Queue 日志的 name ，为空数组代表不过滤任何组件 |

如需开发服务端日志系统，开发者需要实现`CustomLogFunction`方法，[点击查看`CustomLogFunction`实现细节](./logs_sys_dev.md)

## go 控制台快速开发日志

`unmq`内置了`go`开发的控制台日志输出，开发者可快速响应开发；[点击查看使用方法](./termui.md)
