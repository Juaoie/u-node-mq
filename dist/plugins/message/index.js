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
import { Exchange, Queue } from "../../index.js";
import IframeMessageHandle from "./Iframe.js";
var Iframe = (function (_super) {
    __extends(Iframe, _super);
    function Iframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Iframe;
}(Exchange));
var SelfIframe = (function (_super) {
    __extends(SelfIframe, _super);
    function SelfIframe(option) {
        return _super.call(this, option) || this;
    }
    return SelfIframe;
}(Iframe));
export { SelfIframe };
var OtherIframe = (function (_super) {
    __extends(OtherIframe, _super);
    function OtherIframe(option) {
        var _this = _super.call(this, { name: option === null || option === void 0 ? void 0 : option.name }) || this;
        _this.origin = "*";
        if (option === null || option === void 0 ? void 0 : option.origin)
            _this.origin = option.origin;
        return _this;
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
var IframeMessage = (function () {
    function IframeMessage(name, selfIframe, otherIframe, selfQueue, routeMode) {
        if (routeMode === void 0) { routeMode = "Decentralization"; }
        this.iframeMessageHandle = null;
        this.iframeMessageHandle = IframeMessageHandle.createIframe(name, selfIframe, otherIframe, selfQueue, routeMode);
    }
    IframeMessage.prototype.emit = function (exchangeName) {
        var _a;
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        (_a = this.iframeMessageHandle).emit.apply(_a, __spreadArray([exchangeName], __read(contentList), false));
        return this;
    };
    IframeMessage.prototype.on = function (queueName, consume, payload) {
        var _this = this;
        this.iframeMessageHandle.on(queueName, consume, payload);
        return function () { return _this.off(queueName, consume); };
    };
    IframeMessage.prototype.off = function (x, y) {
        this.iframeMessageHandle.off(x, y);
        return this;
    };
    IframeMessage.prototype.once = function (queueName, consume, payload) {
        this.iframeMessageHandle.once(queueName, consume, payload);
        return this;
    };
    return IframeMessage;
}());
export default IframeMessage;
