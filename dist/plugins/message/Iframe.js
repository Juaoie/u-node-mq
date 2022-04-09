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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import UNodeMQ, { Queue } from "../../index.js";
import { broadcastMessage, MessageType, singleMessage } from "./PostMessage.js";
import Centralization from "./coordinate/mode/Centralization.js";
import Decentralization from "./coordinate/mode/Decentralization.js";
export function getInternalIframeMessageQueueName(queueName) {
    return queueName + "_Message";
}
export function getInternalIframeCoordinateQueueName(queueName) {
    return queueName + "_Coordinate";
}
var IframeMessageHandle = (function () {
    function IframeMessageHandle(name, selfIframe, otherIframe, selfQueue, routeMode) {
        var _a;
        if (routeMode === void 0) { routeMode = "Decentralization"; }
        this.name = name;
        var defaultQueueCollection = {};
        for (var name_1 in otherIframe) {
            var queueMessageName = getInternalIframeMessageQueueName(name_1);
            defaultQueueCollection[queueMessageName] = new Queue();
            var queueCoordinateName = getInternalIframeCoordinateQueueName(name_1);
            defaultQueueCollection[queueCoordinateName] = new Queue();
        }
        this.unmq = new UNodeMQ(Object.assign(otherIframe, (_a = {},
            _a[name] = selfIframe,
            _a)), Object.assign(selfQueue, defaultQueueCollection));
        if (routeMode === "Decentralization") {
            this.routeTable = new Decentralization();
        }
        else if (routeMode === "Centralization") {
            this.routeTable = new Centralization();
        }
    }
    IframeMessageHandle.prototype.getName = function () {
        return this.name;
    };
    IframeMessageHandle.prototype.getUnmq = function () {
        return this.unmq;
    };
    IframeMessageHandle.prototype.getRouteTable = function () {
        return this.routeTable;
    };
    IframeMessageHandle.createIframe = function (name, selfIframe, otherIframe, selfQueue, routeMode) {
        if (routeMode === void 0) { routeMode = "Decentralization"; }
        if (this.iframeMessage === null) {
            this.iframeMessage = new IframeMessageHandle(name, selfIframe, otherIframe, selfQueue, routeMode);
            broadcastMessage(MessageType.OnlineNotificationMessage, { exchangeName: name, msg: this.name + "\u4E0A\u7EBF\u4E86" });
        }
        return IframeMessageHandle.iframeMessage;
    };
    IframeMessageHandle.getInstance = function () {
        return IframeMessageHandle.iframeMessage;
    };
    IframeMessageHandle.prototype.emit = function (exchangeName) {
        var _a;
        var _this = this;
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        if (exchangeName === this.name) {
            (_a = this.unmq).emit.apply(_a, __spreadArray([exchangeName], __read(contentList), false));
            return this;
        }
        this.routeTable
            .getCoordinate(exchangeName)
            .then(function (coordinate) {
            var e_1, _a;
            try {
                for (var contentList_1 = __values(contentList), contentList_1_1 = contentList_1.next(); !contentList_1_1.done; contentList_1_1 = contentList_1.next()) {
                    var content = contentList_1_1.value;
                    singleMessage(MessageType.GeneralMessage, coordinate.currentWindow, content, _this.unmq.getExchange(exchangeName).origin);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (contentList_1_1 && !contentList_1_1.done && (_a = contentList_1.return)) _a.call(contentList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        })
            .catch(function () {
            var e_2, _a;
            _this.unmq.getQueue(getInternalIframeMessageQueueName(exchangeName)).removeAllConsumer();
            try {
                for (var contentList_2 = __values(contentList), contentList_2_1 = contentList_2.next(); !contentList_2_1.done; contentList_2_1 = contentList_2.next()) {
                    var content = contentList_2_1.value;
                    _this.unmq.emitToQueue(getInternalIframeMessageQueueName(exchangeName), content);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (contentList_2_1 && !contentList_2_1.done && (_a = contentList_2.return)) _a.call(contentList_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
        return this;
    };
    IframeMessageHandle.prototype.on = function (queueName, consume, payload) {
        var _this = this;
        this.unmq.on(queueName, consume, payload);
        return function () { return _this.off(queueName, consume); };
    };
    IframeMessageHandle.prototype.off = function (x, y) {
        this.unmq.off(x, y);
        return this;
    };
    IframeMessageHandle.prototype.once = function (queueName, consume, payload) {
        this.once(queueName, consume, payload);
        return this;
    };
    IframeMessageHandle.iframeMessage = null;
    return IframeMessageHandle;
}());
export default IframeMessageHandle;
