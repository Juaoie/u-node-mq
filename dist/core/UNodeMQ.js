var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { isFunction } from "../index.js";
import Collection from "./Collection.js";
export function createUnmq(exchangeCollection, queueCollection) {
    return new UNodeMQ(exchangeCollection, queueCollection);
}
var UNodeMQ = (function (_super) {
    __extends(UNodeMQ, _super);
    function UNodeMQ(exchangeCollection, queueCollection) {
        var _this = _super.call(this, exchangeCollection, queueCollection) || this;
        _this.installedPlugins = new Set();
        return _this;
    }
    UNodeMQ.prototype.use = function (plugin) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        if (this.installedPlugins.has(plugin)) {
            console.log("Plugin has already been applied to target unmq.");
        }
        else if (plugin && isFunction(plugin.install)) {
            this.installedPlugins.add(plugin);
            plugin.install.apply(plugin, __spreadArray([this], __read(options), false));
        }
        else if (isFunction(plugin)) {
            this.installedPlugins.add(plugin);
            plugin.apply(void 0, __spreadArray([this], __read(options), false));
        }
        return this;
    };
    UNodeMQ.prototype.emit = function (exchangeName) {
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        _super.prototype.pushContentListToExchange.apply(this, __spreadArray([exchangeName], __read(contentList), false));
        return this;
    };
    UNodeMQ.prototype.emitToQueue = function (queueName) {
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        _super.prototype.pushContentListToQueue.apply(this, __spreadArray([queueName], __read(contentList), false));
        return this;
    };
    UNodeMQ.prototype.on = function (queueName, consume, payload) {
        var _this = this;
        _super.prototype.subscribeQueue.call(this, queueName, consume, payload);
        return function () { return _this.off(queueName, consume); };
    };
    UNodeMQ.prototype.off = function (x, y) {
        _super.prototype.unsubscribeQueue.call(this, x, y);
        return this;
    };
    UNodeMQ.prototype.once = function (queueName, consume, payload) {
        var _this = this;
        var consumeNum = 0;
        var consumeProxy = function (content, next, payload) {
            if (consumeNum === 1)
                return;
            consumeNum++;
            _this.off(queueName, consumeProxy);
            return consume(content, next, payload);
        };
        this.on(queueName, consumeProxy, payload);
        return this;
    };
    return UNodeMQ;
}(Collection));
export default UNodeMQ;
