import IframeMessage from "./IframeMessage.js";
import { getOtherAllIframeDoc } from "./loader.js";
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["GeneralMessage"] = 0] = "GeneralMessage";
    MessageType[MessageType["FindExchangeMessage"] = 1] = "FindExchangeMessage";
    MessageType[MessageType["SendCoordinateMessage"] = 2] = "SendCoordinateMessage";
    MessageType[MessageType["OnlineNotificationMessage"] = 3] = "OnlineNotificationMessage";
})(MessageType || (MessageType = {}));
var postMessage = function (currentWindow, type, message, origin, transfer) {
    if (origin === void 0) { origin = "*"; }
    currentWindow.postMessage({
        mask: "u-node-mq-plugin",
        type: type,
        message: message,
        fromName: IframeMessage.getInstance().getName(),
        fromOrigin: window.origin,
    }, origin, transfer);
};
export function singleMessage(type, currentWindow, message) {
    postMessage(currentWindow, type, message);
}
export function broadcastMessage(type, message) {
    var list = getOtherAllIframeDoc();
    list.forEach(function (item) {
        postMessage(item.window, type, message, "*");
    });
}
window.addEventListener("message", receiveMessage, false);
function receiveMessage(_a) {
    var source = _a.source, data = _a.data, origin = _a.origin;
    var iframeMessage = IframeMessage.getInstance();
    if (typeof data === "object") {
        if (data.mask === "u-node-mq-plugin") {
            if (data.fromOrigin !== origin)
                return;
            if (data.type === MessageType.FindExchangeMessage) {
                var name_1 = iframeMessage.getName();
                var message = data.message;
                if (name_1 === message.exchangeName) {
                    var findExchangeCoordinate = {
                        exchangeName: name_1,
                        random: data.message.random,
                        msg: "\u6211\u662F" + name_1 + "\u3002",
                    };
                    singleMessage(MessageType.SendCoordinateMessage, source, findExchangeCoordinate);
                }
            }
            else if (data.type === MessageType.GeneralMessage) {
                iframeMessage.emit(iframeMessage.getName(), data.message);
            }
            else if (data.type === MessageType.SendCoordinateMessage) {
                var message = data.message;
                iframeMessage.getAcceptCoordinate().pushContent({
                    name: message.exchangeName,
                    random: message.random,
                    currentWindow: source,
                    origin: origin,
                });
            }
            else if (data.type === MessageType.OnlineNotificationMessage) {
                var queueName = data.message.exchangeName + "_SendMessage";
                if (!iframeMessage.getUnmq().getQueue(queueName))
                    return;
                iframeMessage.getUnmq().on(queueName, function (content) {
                    singleMessage(MessageType.GeneralMessage, source, content);
                })();
            }
        }
    }
}
export function broadcastGetCoordinateMessage(exchangeName) {
    var random = Math.round(Math.random() * 10000);
    var findExchangeCoordinate = {
        exchangeName: exchangeName,
        random: random,
        msg: "\u8C01\u662F" + exchangeName + "\uFF1F",
    };
    broadcastMessage(MessageType.FindExchangeMessage, findExchangeCoordinate);
    return new Promise(function (resolve, reject) {
        var iframeMessage = IframeMessage.getInstance();
        var id = setTimeout(function () {
            iframeMessage.getAcceptCoordinate().removeConsumer(getExchangeCoordinae);
            reject();
        }, 1000);
        iframeMessage.getAcceptCoordinate().pushConsume(getExchangeCoordinae);
        function getExchangeCoordinae(messageCoordinate) {
            iframeMessage.getAcceptCoordinate().removeConsumer(getExchangeCoordinae);
            if (messageCoordinate.random == random) {
                clearTimeout(id);
                resolve(messageCoordinate);
            }
        }
    });
}
