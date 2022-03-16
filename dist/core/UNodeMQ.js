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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Collection from "./Collection.js";
export function createUnmq(exchangeCollection, queueCollection) {
    return new UNodeMQ(exchangeCollection, queueCollection);
}
var UNodeMQ = (function (_super) {
    __extends(UNodeMQ, _super);
    function UNodeMQ(exchangeCollection, queueCollection) {
        var _this = this;
        for (var name_1 in exchangeCollection) {
            exchangeCollection[name_1].name = name_1;
        }
        for (var name_2 in queueCollection) {
            queueCollection[name_2].name = name_2;
        }
        _this = _super.call(this, exchangeCollection, queueCollection) || this;
        return _this;
    }
    UNodeMQ.prototype.emit = function (exchangeName) {
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        _super.prototype.pushContentListToExchange.apply(this, __spreadArray([exchangeName], contentList, false));
        return this;
    };
    UNodeMQ.prototype.emitToQueue = function (queueName) {
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        _super.prototype.pushContentListToQueue.apply(this, __spreadArray([queueName], contentList, false));
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
