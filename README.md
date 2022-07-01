- [💠 简介](#introduction)
- [✨ u-node-mq 基本使用方法](#u-node-mq)
- [💨 plugins](./docs/plugins/index.md)
- [🎨 operators](./docs//operators//index.md)

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
  
## `u-node-mq` 是什么？

`u-node-mq`是用来解决前端项目中数据异步通信问题的工具，可以准确的将一个模块的数据传到另一个模块，就像`rabbitMQ`使用发布订阅模型的中间件一样，使用`u-node-mq`可以完全解耦前端模块的耦合；

## 为什么是`u-node-mq`而不是`rxjs`？

`rxjs`是使用 `Observables` 的响应式编程的库，`rxjs`使用的观察者模式，而`u-node-mq`使用的发布订阅模型；虽然两者都可以实现众多复杂的业务场景，但是`rxjs`似乎有着更加陡峭的学习曲线，而`u-node-mq`只需要简单的理解五个基础组件由浅入深的工具；

    `观察者模式`与`发布订阅模型`的区别在于后者多了一个队列，能够在生产者生产数据以后对数据进行存储到队列；

## 其他

- `u-node-mq`在文档和代码注释中有时也会写成简写`unmq`；

- `u-node-mq`中的`u`是标识词；`node`是最初创建项目的执行环境是 node，但是后面经过使用 ts 升级和重构，现在已经升级到可以在所有 js 环境中执行；`mq`是`message queue`的简写；

## [学习更多详细内容](./docs//more.md)

## npm 安装

`pnpm add u-node-mq`

or

`yarn add u-node-mq`

or

`npm install u-node-mq`

<h1 id="u-node-mq">✨ u-node-mq 基本使用方法</h1>

**unmq.js**

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

**模块 A.js**

```javascript
import unmq from "unmq.js";

//发送数据
unmq.emit("ex1", "消息内容1", "消息内容2");
```

**模块 B.js**

```javascript
import unmq from "unmq.js";

//接收并消费数据
unmq.on("qu1", getData);

function getData(data) {
  console.log(data);
}
```