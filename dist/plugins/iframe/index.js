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
import { isObject, isString, Queue } from "../../index.js";
import { getOtherAllIframeDoc } from "./loader.js";
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["GeneralMessage"] = 0] = "GeneralMessage";
    MessageType[MessageType["FindExchangeMessage"] = 1] = "FindExchangeMessage";
    MessageType[MessageType["SendCoordinateMessage"] = 2] = "SendCoordinateMessage";
    MessageType[MessageType["OnlineNotificationMessage"] = 3] = "OnlineNotificationMessage";
})(MessageType || (MessageType = {}));
export var getInternalIframeMessageQueueName = function (queueName) { return queueName + "_Message"; };
export var getInternalIframeBroadcasMessageQueueName = function (queueName) { return queueName + "_Wait_Message"; };
var IframeMessage = (function () {
    function IframeMessage(name) {
        this.name = name;
    }
    IframeMessage.prototype.install = function (unmq) {
        var e_1, _a;
        var _this = this;
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        var selfExchange = unmq.getExchange(this.name);
        if (!selfExchange) {
            throw "".concat(this.name, "\u4EA4\u6362\u673A\u4E0D\u5B58\u5728");
        }
        this.unmq = unmq;
        var list = unmq.getExchangeList();
        var otherIframe = list.filter(function (item) { return item.name !== _this.name; });
        var _loop_1 = function (iframe) {
            iframe.setRepeater(null);
            iframe.setRoutes([
                getInternalIframeMessageQueueName(iframe.name),
                getInternalIframeBroadcasMessageQueueName(iframe.name),
            ]);
            unmq.addQueue(new Queue({ name: getInternalIframeMessageQueueName(iframe.name) }));
            unmq.addQueue(new Queue({ name: getInternalIframeBroadcasMessageQueueName(iframe.name) }));
            unmq.on(getInternalIframeBroadcasMessageQueueName(iframe.name), function () {
                _this.broadcastMessage(MessageType.FindExchangeMessage, {
                    exchangeName: iframe.name,
                    msg: "who is ".concat(_this.name),
                });
            });
        };
        try {
            for (var otherIframe_1 = __values(otherIframe), otherIframe_1_1 = otherIframe_1.next(); !otherIframe_1_1.done; otherIframe_1_1 = otherIframe_1.next()) {
                var iframe = otherIframe_1_1.value;
                _loop_1(iframe);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (otherIframe_1_1 && !otherIframe_1_1.done && (_a = otherIframe_1.return)) _a.call(otherIframe_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.broadcastMessage(MessageType.OnlineNotificationMessage, null);
        window.addEventListener("message", this.receiveMessage.bind(this), false);
    };
    IframeMessage.prototype.receiveMessage = function (_a) {
        var _this = this;
        var source = _a.source, data = _a.data, origin = _a.origin;
        if (!isObject(data))
            return;
        var mask = data.mask, type = data.type, message = data.message, fromName = data.fromName;
        if (mask !== "u-node-mq-plugin")
            return;
        if ([MessageType.OnlineNotificationMessage, MessageType.SendCoordinateMessage].indexOf(type) !== -1) {
            var fromIframe = this.unmq.getExchange(fromName);
            if (!fromIframe)
                return;
            if (isString(fromIframe.origin) && fromIframe.origin !== origin)
                return;
            this.unmq.on(getInternalIframeMessageQueueName(fromName), function (data) {
                _this.postMessage(source, MessageType.GeneralMessage, data, origin);
            })();
            return;
        }
        if (type === MessageType.GeneralMessage)
            return this.unmq.emit(this.name, message);
        if (type === MessageType.FindExchangeMessage && message.exchangeName === this.name) {
            this.postMessage(source, MessageType.SendCoordinateMessage, { msg: "my name is ".concat(this.name) }, origin);
        }
    };
    IframeMessage.prototype.postMessage = function (currentWindow, type, message, origin, transfer) {
        currentWindow.postMessage({
            mask: "u-node-mq-plugin",
            type: type,
            message: message,
            fromName: this.name,
        }, origin, transfer);
    };
    IframeMessage.prototype.broadcastMessage = function (type, message) {
        var _this = this;
        var list = getOtherAllIframeDoc();
        list.forEach(function (item) {
            _this.postMessage(item.window, type, message, "*");
        });
    };
    return IframeMessage;
}());
export default IframeMessage;
