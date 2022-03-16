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
import UNodeMQ, { Exchange, Queue, News } from "../../index.js";
import { broadcastMessage, MessageType, singleMessage } from "./messageProcess.js";
import Centralization from "./coordinate/mode/Centralization.js";
import Decentralization from "./coordinate/mode/Decentralization.js";
import { ConsumMode } from "../../internal/Queue.js";
var Iframe = (function (_super) {
    __extends(Iframe, _super);
    function Iframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Iframe;
}(Exchange));
var SelfIframe = (function (_super) {
    __extends(SelfIframe, _super);
    function SelfIframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SelfIframe;
}(Iframe));
export { SelfIframe };
var OtherIframe = (function (_super) {
    __extends(OtherIframe, _super);
    function OtherIframe(name) {
        return _super.call(this, { name: name }) || this;
    }
    return OtherIframe;
}(Iframe));
export { OtherIframe };
var SelfQueue = (function (_super) {
    __extends(SelfQueue, _super);
    function SelfQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SelfQueue;
}(Queue));
export { SelfQueue };
var NewsExpand = (function (_super) {
    __extends(NewsExpand, _super);
    function NewsExpand(content) {
        return _super.call(this, content) || this;
    }
    return NewsExpand;
}(News));
export { NewsExpand };
var IframeMessage = (function () {
    function IframeMessage(name, selfIframe, otherIframe, selfQueue, routeMode) {
        var _a;
        var _this = this;
        if (routeMode === void 0) { routeMode = "Decentralization"; }
        this.acceptMessage = new SelfQueue();
        this.acceptCoordinate = new SelfQueue({ mode: ConsumMode.All });
        this.name = name;
        var queueCollection = {};
        for (var name_1 in otherIframe) {
            var queueName = name_1 + "_SendMessage";
            queueCollection[queueName] = new Queue();
            otherIframe[name_1].setRoutes([queueName]);
        }
        this.unmq = new UNodeMQ(Object.assign(otherIframe, (_a = {},
            _a[name] = selfIframe,
            _a)), Object.assign(selfQueue, queueCollection));
        if (routeMode === "Decentralization") {
            this.routeTable = new Decentralization();
        }
        else if (routeMode === "Centralization") {
            this.routeTable = new Centralization();
        }
        this.acceptMessage.pushConsume(function (content) {
            _this.unmq.emit(name, content);
            return true;
        });
    }
    IframeMessage.prototype.getName = function () {
        return this.name;
    };
    IframeMessage.prototype.getUnmq = function () {
        return this.unmq;
    };
    IframeMessage.prototype.getAcceptCoordinate = function () {
        return this.acceptCoordinate;
    };
    IframeMessage.prototype.getRouteTable = function () {
        return this.routeTable;
    };
    IframeMessage.createIframe = function (name, selfIframe, otherIframe, selfQueue, routeMode) {
        if (routeMode === void 0) { routeMode = "Decentralization"; }
        if (this.iframeMessage === null) {
            this.iframeMessage = new IframeMessage(name, selfIframe, otherIframe, selfQueue, routeMode);
            broadcastMessage(MessageType.OnlineNotificationMessage, { exchangeName: name, msg: this.name + "\u4E0A\u7EBF\u4E86" });
        }
        return IframeMessage.iframeMessage;
    };
    IframeMessage.getInstance = function () {
        return IframeMessage.iframeMessage;
    };
    IframeMessage.prototype.emit = function (exchangeName) {
        var _a;
        var _this = this;
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        if (exchangeName === this.name) {
            (_a = this.unmq).emit.apply(_a, __spreadArray([exchangeName], contentList, false));
            return this;
        }
        this.routeTable
            .getCoordinate(exchangeName)
            .then(function (coordinate) {
            for (var _i = 0, contentList_1 = contentList; _i < contentList_1.length; _i++) {
                var content = contentList_1[_i];
                singleMessage(MessageType.GeneralMessage, coordinate.currentWindow, content);
            }
        })
            .catch(function () {
            _this.unmq.getQueue(exchangeName + "_SendMessage").removeAllConsumer();
            for (var _i = 0, contentList_2 = contentList; _i < contentList_2.length; _i++) {
                var content = contentList_2[_i];
                _this.unmq.emit(exchangeName, content);
            }
        });
        return this;
    };
    IframeMessage.prototype.on = function (queueName, consume, payload) {
        var _this = this;
        this.unmq.on(queueName, consume, payload);
        return function () { return _this.off(queueName, consume); };
    };
    IframeMessage.prototype.off = function (x, y) {
        this.unmq.off(x, y);
        return this;
    };
    IframeMessage.prototype.once = function (queueName, consume, payload) {
        this.once(queueName, consume, payload);
        return this;
    };
    IframeMessage.iframeMessage = null;
    return IframeMessage;
}());
export default IframeMessage;
