var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ConsumMode: () => ConsumMode,
  Consumer: () => Consumer,
  Exchange: () => Exchange2,
  IframePlugin: () => IframePlugin,
  Logs: () => Logs,
  News: () => News2,
  Queue: () => Queue3,
  QuickUNodeMQ: () => QuickUNodeMQ,
  createQuickUnmq: () => createQuickUnmq,
  createUnmq: () => createUnmq,
  debounceTime: () => debounceTime,
  default: () => src_default,
  extend: () => extend,
  interval: () => interval,
  isArray: () => isArray,
  isBoolean: () => isBoolean,
  isDate: () => isDate,
  isFunction: () => isFunction,
  isMap: () => isMap,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isPromise: () => isPromise,
  isSet: () => isSet,
  isString: () => isString,
  isSymbol: () => isSymbol,
  map: () => map,
  newsTime: () => newsTime,
  objectToString: () => objectToString,
  of: () => of,
  task: () => task,
  throttleTime: () => throttleTime,
  toTypeString: () => toTypeString
});
module.exports = __toCommonJS(src_exports);

// src/internal/Logs.ts
var Logs = class {
  static error(message) {
    console.error(message);
  }
  static log(message) {
    console.log(message);
  }
};
Logs.unmq = null;

// src/core/ExchangeCollectionHandle.ts
var ExchangeCollectionHandle = class {
  constructor() {
    this.exchangeCollection = /* @__PURE__ */ new Map();
  }
  has(exchangeName) {
    if (this.exchangeCollection.has(exchangeName))
      return true;
    else {
      Logs.error(`${exchangeName} not find`);
      return false;
    }
  }
  setExchangeCollection(exchangeCollection) {
    this.exchangeCollection = new Map(Object.entries(exchangeCollection));
  }
  getExchange(exchangeName) {
    const exchange = this.exchangeCollection.get(exchangeName);
    if (exchange === void 0) {
      Logs.error(`${exchangeName} not find`);
      return null;
    }
    return exchange;
  }
  getExchangeList() {
    return [...this.exchangeCollection.values()];
  }
  getQueueNameList(exchangeName, content) {
    return __async(this, null, function* () {
      const exchagne = this.getExchange(exchangeName);
      if (exchagne === null)
        return [];
      return exchagne.getQueueNameList(content);
    });
  }
};

// src/core/QueueCollectionHandle.ts
var QueueCollectionHandle = class {
  constructor() {
    this.queueCollection = /* @__PURE__ */ new Map();
  }
  has(queueName) {
    if (this.queueCollection.has(queueName))
      return true;
    else {
      Logs.error(`${queueName} not find`);
      return false;
    }
  }
  setQueueCollection(queueCollection) {
    this.queueCollection = new Map(Object.entries(queueCollection));
  }
  getQueue(queueName) {
    const queue = this.queueCollection.get(queueName);
    if (queue === void 0) {
      Logs.error(`${queueName} not find`);
      return null;
    }
    return queue;
  }
  getQueueList() {
    return [...this.queueCollection.values()];
  }
  addQueue(queue) {
    if (queue.name === void 0)
      throw "queue.name is undefined";
    this.queueCollection.set(queue.name, queue);
  }
  pushNewsToQueue(queueName, news) {
    var _a;
    (_a = this.getQueue(queueName)) == null ? void 0 : _a.pushNews(news);
  }
  pushContentToQueue(queueName, content) {
    var _a;
    (_a = this.getQueue(queueName)) == null ? void 0 : _a.pushContent(content);
  }
  subscribeQueue(queueName, consume, payload) {
    var _a;
    (_a = this.getQueue(queueName)) == null ? void 0 : _a.pushConsume(consume, payload);
  }
  unsubscribeQueue(queueName, consume) {
    var _a, _b;
    if (!this.has(queueName))
      return false;
    if (isFunction(consume)) {
      return !!((_a = this.getQueue(queueName)) == null ? void 0 : _a.removeConsumer(consume));
    } else {
      return !!((_b = this.getQueue(queueName)) == null ? void 0 : _b.removeAllConsumer());
    }
  }
};

// src/core/Collection.ts
var Collection = class {
  constructor(exchangeCollection, queueCollection) {
    this.exchangeCollectionHandle = new ExchangeCollectionHandle();
    this.queueCollectionHandle = new QueueCollectionHandle();
    for (const name in exchangeCollection) {
      exchangeCollection[name].name = name;
    }
    for (const name in queueCollection) {
      queueCollection[name].name = name;
    }
    this.exchangeCollectionHandle.setExchangeCollection(exchangeCollection);
    this.queueCollectionHandle.setQueueCollection(queueCollection);
  }
  getExchange(exchangeName) {
    return this.exchangeCollectionHandle.getExchange(exchangeName);
  }
  getExchangeList() {
    return this.exchangeCollectionHandle.getExchangeList();
  }
  getQueue(queueName) {
    return this.queueCollectionHandle.getQueue(queueName);
  }
  getQueueList() {
    return this.queueCollectionHandle.getQueueList();
  }
  addQueue(queue) {
    this.queueCollectionHandle.addQueue(queue);
  }
  pushNewsListToExchange(exchangeName, ...news) {
    for (const newsItem of news) {
      this.exchangeCollectionHandle.getQueueNameList(exchangeName, newsItem.content).then((queueNameList) => {
        for (const queueName in queueNameList) {
          this.pushNewsListToQueue(queueName, newsItem);
        }
      });
    }
  }
  pushNewsListToQueue(queueName, ...news) {
    for (const newsItem of news) {
      this.queueCollectionHandle.pushNewsToQueue(queueName, newsItem);
    }
  }
  pushContentListToExchange(exchangeName, ...contentList) {
    for (const content of contentList) {
      this.exchangeCollectionHandle.getQueueNameList(exchangeName, content).then((queueNameList) => {
        for (const queueName of queueNameList) {
          this.pushContentListToQueue(queueName, content);
        }
      });
    }
  }
  pushContentListToQueue(queueName, ...contentList) {
    for (const content of contentList) {
      this.queueCollectionHandle.pushContentToQueue(queueName, content);
    }
  }
  subscribeQueue(queueName, consume, payload) {
    this.queueCollectionHandle.subscribeQueue(queueName, consume, payload);
  }
  unsubscribeQueue(queueName, consume) {
    this.queueCollectionHandle.unsubscribeQueue(queueName, consume);
  }
};

// src/core/UNodeMQ.ts
function createUnmq(exchangeCollection, queueCollection) {
  return new UNodeMQ(exchangeCollection, queueCollection);
}
var UNodeMQ = class extends Collection {
  constructor(exchangeCollection, queueCollection) {
    super(exchangeCollection, queueCollection);
    this.installedPlugins = /* @__PURE__ */ new Set();
  }
  use(plugin, ...options) {
    if (this.installedPlugins.has(plugin)) {
      console.log(`Plugin has already been applied to target unmq.`);
    } else if (plugin && isFunction(plugin.install)) {
      this.installedPlugins.add(plugin);
      plugin.install(this, ...options);
    } else if (isFunction(plugin)) {
      this.installedPlugins.add(plugin);
      plugin(this, ...options);
    }
    return this;
  }
  emit(exchangeName, ...contentList) {
    super.pushContentListToExchange(exchangeName, ...contentList);
    return this;
  }
  emitToQueue(queueName, ...contentList) {
    super.pushContentListToQueue(queueName, ...contentList);
    return this;
  }
  on(queueName, consume, payload) {
    super.subscribeQueue(queueName, consume, payload);
    return () => this.off(queueName, consume);
  }
  off(x, y) {
    super.unsubscribeQueue(x, y);
    return this;
  }
  once(queueName, consume, payload) {
    if (!isFunction(consume)) {
      return new Promise((resolve) => {
        const consumeProxy = (content) => {
          this.off(queueName, consumeProxy);
          resolve(content);
          return true;
        };
        this.on(queueName, consumeProxy, payload);
      });
    } else {
      const consumeProxy = (content, next, payload2) => {
        this.off(queueName, consumeProxy);
        return consume(content, next, payload2);
      };
      this.on(queueName, consumeProxy, payload);
      return this;
    }
  }
};
function createQuickUnmq(exchange, queueCollection) {
  return new QuickUNodeMQ(exchange, queueCollection);
}
var QuickUNodeMQ = class {
  constructor(exchange, queueCollection) {
    this.exchange = exchange;
    this.queueCollection = queueCollection;
    for (const name in queueCollection) {
      queueCollection[name].name = name;
    }
  }
  emit(...contentList) {
    for (const content of contentList) {
      this.exchange.getQueueNameList(content).then((queueNameList) => {
        for (const queueName of queueNameList) {
          if (this.queueCollection[queueName] === void 0)
            continue;
          this.queueCollection[queueName].pushContent(content);
        }
      });
    }
    return this;
  }
  emitToQueue(queueName, ...contentList) {
    for (const content of contentList) {
      this.queueCollection[queueName].pushContent(content);
    }
    return this;
  }
  on(queueName, consume, payload) {
    this.queueCollection[queueName].pushConsume(consume, payload);
    return () => this.off(queueName, consume);
  }
  off(x, y) {
    if (isFunction(y)) {
      this.queueCollection[x].removeConsumer(y);
    } else
      this.queueCollection[x].removeAllConsumer();
    return this;
  }
  once(queueName, consume, payload) {
    if (!isFunction(consume)) {
      return new Promise((resolve) => {
        const consumeProxy = (content) => {
          this.off(queueName, consumeProxy);
          resolve(content);
          return true;
        };
        this.on(queueName, consumeProxy, payload);
      });
    } else {
      const consumeProxy = (content, next, payload2) => {
        this.off(queueName, consumeProxy);
        return consume(content, next, payload2);
      };
      this.on(queueName, consumeProxy, payload);
      return this;
    }
  }
};

// src/utils/tools.ts
var Tools = class {
  static random() {
    return String(Math.round(Math.random() * 1e10));
  }
  static getTimeFormat(time) {
    let now = null;
    if (time)
      now = new Date(time);
    else
      now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hh = now.getHours();
    const mm = now.getMinutes();
    let clock = year + "-";
    if (month < 10)
      clock += "0";
    clock += month + "-";
    if (day < 10)
      clock += "0";
    clock += day + " ";
    if (hh < 10)
      clock += "0";
    clock += hh + ":";
    if (mm < 10)
      clock += "0";
    clock += mm;
    return clock;
  }
};
Tools.promiseSetTimeout = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));
Tools.memorySize = (str) => {
  let totalLength = 0;
  let charCode;
  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 127) {
      totalLength++;
    } else if (128 <= charCode && charCode <= 2047) {
      totalLength += 2;
    } else if (2048 <= charCode && charCode <= 65535) {
      totalLength += 3;
    } else {
      totalLength += 4;
    }
  }
  if (totalLength >= 1024 * 1024)
    return (totalLength / (1024 * 1024)).toFixed(2) + "MB";
  if (totalLength >= 1024 && totalLength < 1024 * 1024)
    return (totalLength / 1024).toFixed(2) + "KB";
  else
    return totalLength + "B";
};

// src/internal/Exchange.ts
var Exchange2 = class {
  constructor(option) {
    this.id = Tools.random();
    this.routes = [];
    this.repeater = () => this.getRoutes();
    Object.assign(this, option);
  }
  getId() {
    return this.id;
  }
  getRoutes() {
    return this.routes;
  }
  pushRoutes(routes) {
    this.routes = Array.from(new Set(this.routes.concat(routes)));
  }
  setRoutes(routes) {
    this.routes = routes;
  }
  getRepeater() {
    return this.repeater;
  }
  setRepeater(repeater) {
    this.repeater = repeater;
  }
  removeRoutes(routes) {
    if (routes === void 0)
      this.routes = [];
    else
      this.routes = this.routes.filter((item) => routes.indexOf(item) !== -1);
  }
  getQueueNameList(content) {
    return __async(this, null, function* () {
      try {
        return yield this.repeater(content);
      } catch (error) {
        Logs.error(`exchange function getstringList exception`);
        return [];
      }
    });
  }
};

// src/internal/News.ts
var News2 = class {
  constructor(content) {
    this.id = Tools.random();
    this.consumedTimes = -1;
    this.createTime = new Date().getTime();
    this.content = content;
  }
  getId() {
    return this.id;
  }
};

// src/internal/Consumer.ts
var Consumer = class {
  constructor(consume, payload) {
    this.id = Tools.random();
    this.createTime = new Date().getTime();
    this.consume = consume;
    this.payload = payload;
  }
  getId() {
    return this.id;
  }
  consumption(news, ask) {
    const then = (thenParameter) => {
      try {
        if (!ask) {
          this.consume(news.content, this.payload);
          return thenParameter(true);
        }
        let confirm = (value = true) => thenParameter(value);
        const res = this.consume(news.content, confirm, this.payload);
        if (isPromise(res)) {
          res.then((onfulfilled) => {
            thenParameter(Boolean(onfulfilled));
          }).catch(() => {
            thenParameter(false);
          });
        } else if (typeof res === "boolean") {
          confirm = () => {
          };
          thenParameter(res);
        }
      } catch (error) {
        Logs.error("Consumer consumption error");
        thenParameter(!ask);
      }
    };
    return {
      then
    };
  }
};

// src/internal/Queue.ts
var ConsumMode = /* @__PURE__ */ ((ConsumMode2) => {
  ConsumMode2["Random"] = "Random";
  ConsumMode2["All"] = "All";
  return ConsumMode2;
})(ConsumMode || {});
function isAsyncOperator(arg) {
  return ["mounted", "addedNews", "addedConsumer", "removedConsumer"].indexOf(arg) !== -1;
}
function isSyncOperator(arg) {
  return ["beforeAddNews", "ejectedNews"].indexOf(arg) !== -1;
}
var Queue3 = class {
  constructor(option) {
    this.id = Tools.random();
    this.ask = false;
    this.rcn = 3;
    this.mode = "All" /* All */;
    this.async = false;
    this.state = false;
    this.maxTime = 3e3;
    this.news = [];
    this.consumerList = [];
    this.operators = [];
    Object.assign(this, option);
  }
  getId() {
    return this.id;
  }
  getNews() {
    return this.news;
  }
  removeAllNews() {
    this.news = [];
    return true;
  }
  pushNews(news) {
    if (news.consumedTimes === -1)
      news.consumedTimes = this.rcn;
    if (news.consumedTimes > 0) {
      if (this.news.findIndex((item) => item.getId() === news.getId()) === -1) {
        this.operate("beforeAddNews", news).then((isOk) => {
          if (!isOk)
            return;
          this.news.push(news);
          this.operate("addedNews", news);
          if (this.news.length > 0 && this.consumerList.length > 0)
            this.consumeNews();
        });
      }
    }
  }
  pushContent(content) {
    const news = new News2(content);
    this.pushNews(news);
  }
  removeNewsById(newsId) {
    const index = this.news.findIndex((item) => item.getId() === newsId);
    if (index === -1)
      return false;
    this.news.splice(index, 1);
    return true;
  }
  getConsumerList() {
    return this.consumerList;
  }
  pushConsumer(consumer) {
    if (this.consumerList.findIndex((item) => item.getId() === consumer.getId()) === -1) {
      this.consumerList.push(consumer);
      this.operate("addedConsumer", consumer);
      if (this.news.length > 0 && this.consumerList.length > 0)
        this.consumeNews();
    }
  }
  removeConsumer(consume) {
    const index = this.consumerList.findIndex((item) => item.consume === consume);
    if (index === -1)
      return false;
    const consumerList = this.consumerList.splice(index, 1);
    this.operate("removedConsumer", consumerList);
    return true;
  }
  pushConsume(consume, payload) {
    const consumer = new Consumer(consume, payload);
    this.pushConsumer(consumer);
  }
  removeConsumerById(consumerId) {
    const index = this.consumerList.findIndex((item) => item.getId() === consumerId);
    if (index === -1)
      return false;
    const consumerList = this.consumerList.splice(index, 1);
    this.operate("removedConsumer", consumerList);
    return true;
  }
  removeAllConsumer() {
    const consumerList = this.consumerList.splice(0);
    this.operate("removedConsumer", consumerList);
    return true;
  }
  add(operator) {
    this.operators.push(operator);
    if (operator == null ? void 0 : operator.mounted)
      operator.mounted(this);
    return this;
  }
  operate(_0) {
    return __async(this, arguments, function* (fun, ...args) {
      const list = this.operators.filter((operator) => operator[fun]).map((operator) => operator[fun]);
      if (isAsyncOperator(fun)) {
        for (const iterator of list) {
          iterator == null ? void 0 : iterator(arguments[1]);
        }
      } else if (isSyncOperator(fun)) {
        for (const iterator of list) {
          if (!(yield iterator == null ? void 0 : iterator(arguments[1])))
            return false;
        }
      } else
        throw "operate error";
      return true;
    });
  }
  consumeNews() {
    return __async(this, null, function* () {
      if (this.news.length === 0)
        return;
      if (this.consumerList.length === 0)
        return;
      if (!this.async && this.state)
        return;
      this.state = true;
      const consumerList = this.mode === "Random" /* Random */ ? [this.consumerList[Math.round(Math.random() * (this.consumerList.length - 1))]] : [...this.consumerList];
      const news = this.news.splice(0, 1)[0];
      this.consumeNews();
      if (!(yield this.operate("ejectedNews", news))) {
        this.state = false;
        this.consumeNews();
        return;
      }
      Promise.all(consumerList.map((consumer) => this.consumption(news, consumer))).then(() => {
      }).catch(() => {
        news.consumedTimes--;
        this.pushNews(news);
      }).finally(() => {
        this.state = false;
        this.consumeNews();
      });
    });
  }
  consumption(news, consumer) {
    return new Promise((resolve, reject) => {
      const maxTime = this.maxTime;
      const id = maxTime >= 0 ? setTimeout(() => {
        reject(false);
      }, maxTime) : void 0;
      consumer.consumption(news, this.ask).then((isOk) => {
        if (isOk) {
          resolve(isOk);
        } else {
          reject(isOk);
        }
        if (maxTime >= 0)
          clearTimeout(id);
      });
    });
  }
};

// src/plugins/iframe/loader.ts
function getOtherAllIframeDoc() {
  if (window.top === null)
    throw "window.top is null";
  const list = getAllIframeDoc(window.top, 0, 0);
  return list.filter((item) => item.window !== window.self);
}
function getAllIframeDoc(w, x, y) {
  const arr = [];
  arr.push({
    window: w,
    x,
    y
  });
  y += 1;
  for (let k = 0; k < w.length; k++) {
    arr.push(...getAllIframeDoc(w[k], x, y));
    x += 1;
  }
  return arr;
}

// src/plugins/iframe/index.ts
var getInternalIframeMessageQueueName = (queueName) => queueName + "_Iframe_Message";
var getInternalIframeBroadcasMessageQueueName = (queueName) => queueName + "_Iframe_Wait_Message";
var IframePlugin = class {
  constructor(name) {
    this.name = name;
    this.unmq = null;
    this.name = name;
  }
  install(unmq, ...options) {
    const selfExchange = unmq.getExchange(this.name);
    if (!selfExchange) {
      throw `${this.name}\u4EA4\u6362\u673A\u4E0D\u5B58\u5728`;
    }
    this.unmq = unmq;
    const list = unmq.getExchangeList();
    const otherIframe = list.filter((item) => item.name !== this.name);
    for (const iframe of otherIframe) {
      if (iframe.name === void 0)
        throw `\u7CFB\u7EDF\u9519\u8BEF`;
      iframe.setRepeater(() => [
        getInternalIframeMessageQueueName(iframe.name),
        getInternalIframeBroadcasMessageQueueName(iframe.name)
      ]);
      unmq.addQueue(new Queue3({ name: getInternalIframeMessageQueueName(iframe.name), async: true }));
      unmq.addQueue(new Queue3({ name: getInternalIframeBroadcasMessageQueueName(iframe.name), async: true }));
      unmq.on(getInternalIframeBroadcasMessageQueueName(iframe.name), () => {
        this.broadcastMessage(1 /* FindExchangeMessage */, {
          exchangeName: iframe.name,
          msg: `who is ${iframe.name} ?`
        });
      });
    }
    this.broadcastMessage(3 /* OnlineNotificationMessage */, { msg: `${this.name} is online` });
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }
  receiveMessage({ source, data, origin }) {
    if (this.unmq === null)
      throw `${this.name} iframe \u672A\u5B89\u88C5`;
    if (!isObject(data))
      return;
    const { mask, type, message, fromName } = data;
    if (mask !== "u-node-mq-plugin")
      return;
    if (source === null || source === void 0)
      return;
    const fromIframe = this.unmq.getExchange(fromName);
    if (!fromIframe)
      return;
    if (isString(fromIframe.origin) && fromIframe.origin !== origin)
      return;
    if ([3 /* OnlineNotificationMessage */, 2 /* SendCoordinateMessage */].indexOf(type) !== -1) {
      const off = this.unmq.on(getInternalIframeMessageQueueName(fromName), (data2) => {
        this.postMessage(source, 0 /* GeneralMessage */, data2, origin);
      });
      setTimeout(off);
      return true;
    }
    if (type === 0 /* GeneralMessage */) {
      this.unmq.emit(this.name, message);
      return true;
    }
    if (type === 1 /* FindExchangeMessage */ && message.exchangeName === this.name) {
      this.postMessage(source, 2 /* SendCoordinateMessage */, { msg: `my name is ${this.name}` }, origin);
      return true;
    }
  }
  postMessage(currentWindow, type, message, origin = "*", transfer) {
    currentWindow.postMessage({
      mask: "u-node-mq-plugin",
      type,
      message,
      fromName: this.name
    }, origin, transfer);
  }
  broadcastMessage(type, message) {
    const list = getOtherAllIframeDoc();
    list.forEach((item) => {
      this.postMessage(item.window, type, message, "*");
    });
  }
};

// src/operators/map.ts
function map(project) {
  let index = 0;
  return {
    beforeAddNews(num) {
      num.content = project(num.content, index);
      index++;
      return true;
    }
  };
}

// src/operators/debounceTime.ts
function debounceTime(dueTime, immediate) {
  let now = 0;
  let timeId = null;
  let res;
  return {
    beforeAddNews() {
      const t = new Date().getTime();
      if (immediate) {
        const n = now;
        now = t;
        return t > n + dueTime;
      } else {
        if (timeId !== null && t <= now + dueTime) {
          res(false);
          clearTimeout(timeId);
        }
        now = t;
        return new Promise((resolve) => {
          res = resolve;
          timeId = setTimeout(() => {
            timeId = null;
            resolve(true);
          }, dueTime);
        });
      }
    }
  };
}

// src/operators/throttleTime.ts
function throttleTime(duration, immediate) {
  let now = 0;
  let timeId = null;
  return {
    beforeAddNews() {
      const t = new Date().getTime();
      if (immediate) {
        if (t <= now + duration)
          return false;
        now = t;
        return true;
      } else {
        if (timeId !== null)
          return false;
        return new Promise((resolve) => {
          timeId = setTimeout(() => {
            timeId = null;
            resolve(true);
          }, duration);
        });
      }
    }
  };
}

// src/operators/task.ts
function task(count) {
  let seen = 0;
  return {
    beforeAddNews() {
      return ++seen <= count;
    }
  };
}

// src/operators/newsTime.ts
function newsTime(time) {
  return {
    ejectedNews(news) {
      return new Date().getTime() < time + news.createTime;
    }
  };
}

// src/operators/of.ts
function of(...args) {
  return {
    mounted(queue) {
      args.forEach((item) => {
        queue.pushContent(item);
      });
    }
  };
}

// src/operators/interval.ts
function interval(period = 1e3, optimal = true) {
  if (period < 0)
    period = 0;
  let num = 0;
  let id = null;
  let interval2 = {
    go: () => {
    },
    stop: () => {
    }
  };
  let queue;
  return {
    mounted(that) {
      queue = that;
      interval2 = {
        go() {
          id = setInterval(() => {
            num++;
            queue.pushContent(num);
          }, period);
        },
        stop() {
          if (id === null)
            return;
          clearInterval(id);
          id = null;
        }
      };
      if (queue.getConsumerList.length > 0) {
        interval2.go();
      } else if (!optimal) {
        interval2.go();
      }
    },
    addedConsumer() {
      if (!optimal)
        return;
      if (id !== null)
        return;
      interval2.go();
    },
    removedConsumer(consumerList) {
      if (!optimal)
        return;
      if (id === null)
        return;
      if (queue.getConsumerList.length === 0)
        interval2.stop();
      return "";
    }
  };
}

// src/index.ts
var src_default = UNodeMQ;
var extend = Object.assign;
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isSet = (val) => toTypeString(val) === "[object Set]";
var isDate = (val) => val instanceof Date;
var isFunction = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isNumber = (val) => typeof val === "number";
var isBoolean = (val) => typeof val === "boolean";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConsumMode,
  Consumer,
  Exchange,
  IframePlugin,
  Logs,
  News,
  Queue,
  QuickUNodeMQ,
  createQuickUnmq,
  createUnmq,
  debounceTime,
  extend,
  interval,
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isMap,
  isNumber,
  isObject,
  isPromise,
  isSet,
  isString,
  isSymbol,
  map,
  newsTime,
  objectToString,
  of,
  task,
  throttleTime,
  toTypeString
});
//# sourceMappingURL=u-node-mq.js.map
