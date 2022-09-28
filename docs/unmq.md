# 快速开发

开发中常用的两种方式

- `UNodeMQ` 一个`UNodeMQ`类中集合了多个交换机和多个队列，使用场景为多个交换机中有队列进行数据交叉路由的情况；`createUnmq`为`UNodeMQ` 类的函数式方法；

- `QuickUNodeMQ` 包含一个交换机和多个队列的类，在单一路由的情况中可以快速开发使用；`createQuickUnmq`为`QuickUNodeMQ` 类的函数式方法；

## 1、UNodeMQ

```javascript
import UNodeMQ, { createUnmq } from "u-node-mq";
const unmq = new UNodeMQ(ExchangeCollection, QueueCollection);
//or
const unmq = createUnmq(ExchangeCollection, QueueCollection);
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

## 2、QuickUNodeMQ

```javascript
import { QuickUNodeMQ, createQuickUnmq, ExchangeOption, Exchange } from "u-node-mq";
const quickUnmq = new QuickUNodeMQ(ExchangeOption | Exchange, QueueCollection);
//or
const quickUnmq = createQuickUnmq(ExchangeOption | Exchange, QueueCollection);
```

创建模块

**QuickUNodeMQ constructor 参数说明**

| 名称            | 类型               | 必填 | 说明           |
| --------------- | ------------------ | ---- | -------------- |
| ExchangeOption  | QueueCollection    | 是   | 交互机配置参数 |
| Exchange        | Exchange           | 是   | 交换机         |
| QueueCollection | { string : Queue } | 是   | 队列集合       |

**quickUnmq 方法说明**

| 名称        | 参数类型                           | 说明                                                           |
| ----------- | ---------------------------------- | -------------------------------------------------------------- |
| emit        | (ExchangeName , ...消息)           | 发送数据到交换机，返回 this                                    |
| emitToQueue | (QueueName , ...消息)              | 发送数据到交换机，返回 this                                    |
| on          | (QueueName , 消费方法 , ?载荷消息) | 订阅队列消息，载荷信息每次都会发送给消费者，返回取消订阅的函数 |
| off         | (QueueName , ?消费方法)            | 移除队列上的指定消费者或者移除队列上所有消费者，返回 this      |
| once        | (QueueName , 消费方法 , ?载荷消息) | 只消费一条消息，返回 this                                      |

## 3、SingleUNodeMQ

```javascript
import { SingleUNodeMQ, createSingleUnmq, QueueOption, Queue } from "u-node-mq";
const singleUnmq = new SingleUNodeMQ(QueueOption | Queue);
//or
const singleUnmq = createSingleUnmq(QueueOption | Queue);
```

创建模块

**SingleUNodeMQ constructor 参数说明**

| 名称        | 类型     | 必填 | 说明         |
| ----------- | -------- | ---- | ------------ |
| QueueOption | Exchange | 是   | 队列配置参数 |
| Queue       | Exchange | 是   | 队列实例     |

**singleUnmq 方法说明**

| 名称 | 参数类型                                                   | 说明                                                           |
| ---- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| emit | ( ...消息)                                                 | 发送数据到队列，返回 this                                      |
| on   | ( 消费方法 , ?载荷消息)                                    | 订阅队列消息，载荷信息每次都会发送给消费者，返回取消订阅的函数 |
| off  | ( ?消费方法)                                               | 移除队列上的指定消费者或者移除队列上所有消费者，返回 this      |
| once | ( 消费方法 , ?载荷消息)                                    | 只消费一条消息，返回 this                                      |
| add  | 向当前队列添加 operators                                   | 返回 this                                                      |
| fork | 在当前队列队尾添加一个新的队列，使当前队列和新队列数据连通 | 返回新的队列                                                   |
