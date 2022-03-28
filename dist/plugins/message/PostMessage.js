import IframeMessage, { getInternalIframeCoordinateQueueName, getInternalIframeMessageQueueName, } from "./Iframe.js";
import { getOtherAllIframeDoc } from "./loader.js";
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["GeneralMessage"] = 0] = "GeneralMessage";
    MessageType[MessageType["FindExchangeMessage"] = 1] = "FindExchangeMessage";
    MessageType[MessageType["SendCoordinateMessage"] = 2] = "SendCoordinateMessage";
    MessageType[MessageType["OnlineNotificationMessage"] = 3] = "OnlineNotificationMessage";
})(MessageType || (MessageType = {}));
var postMessage = function (currentWindow, type, message, origin, transfer) {
    currentWindow.postMessage({
        mask: "u-node-mq-plugin",
        type: type,
        message: message,
        fromName: IframeMessage.getInstance().getName(),
        fromOrigin: window.origin,
    }, origin, transfer);
};
export function singleMessage(type, currentWindow, message, origin) {
    postMessage(currentWindow, type, message, origin);
}
export function broadcastMessage(type, message) {
    var list = getOtherAllIframeDoc();
    list.forEach(function (item) {
        postMessage(item.window, type, message, "*");
    });
}
function findExchangeMessage(source, data, origin) {
    var iframeMessage = IframeMessage.getInstance();
    var name = iframeMessage.getName();
    var message = data.message;
    if (name === message.exchangeName) {
        var findExchangeCoordinate = {
            exchangeName: name,
            random: data.message.random,
            msg: "\u6211\u662F" + name + "\u3002",
        };
        singleMessage(MessageType.SendCoordinateMessage, source, findExchangeCoordinate, "*");
    }
}
function generalMessage(source, data, origin) {
    var iframeMessage = IframeMessage.getInstance();
    iframeMessage.emit(iframeMessage.getName(), data.message);
}
function sendCoordinateMessage(source, data, origin) {
    var iframeMessage = IframeMessage.getInstance();
    var fromExchange = iframeMessage.getUnmq().getExchange(data.fromName);
    if (fromExchange === undefined)
        return;
    if (fromExchange.origin !== "*" && fromExchange.origin !== origin)
        return;
    var message = data.message;
    iframeMessage.getUnmq().emitToQueue(getInternalIframeCoordinateQueueName(message.exchangeName), {
        name: message.exchangeName,
        random: message.random,
        currentWindow: source,
        origin: origin,
    });
}
function onlineNotificationMessage(source, data, origin) {
    var iframeMessage = IframeMessage.getInstance();
    var fromExchange = iframeMessage.getUnmq().getExchange(data.fromName);
    if (fromExchange === undefined)
        return;
    if (fromExchange.origin !== "*" && fromExchange.origin !== origin)
        return;
    var message = data.message;
    var queueName = getInternalIframeMessageQueueName(data.message.exchangeName);
    if (!iframeMessage.getUnmq().getQueue(queueName))
        return;
    iframeMessage.getUnmq().on(queueName, function (content) {
        singleMessage(MessageType.GeneralMessage, source, content, fromExchange.origin);
    })();
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
                findExchangeMessage(source, data, origin);
            }
            else if (data.type === MessageType.GeneralMessage) {
                generalMessage(source, data, origin);
            }
            else if (data.type === MessageType.SendCoordinateMessage) {
                sendCoordinateMessage(source, data, origin);
            }
            else if (data.type === MessageType.OnlineNotificationMessage) {
                onlineNotificationMessage(source, data, origin);
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
        var unmq = iframeMessage.getUnmq();
        var id = setTimeout(function () {
            unmq.off(getInternalIframeCoordinateQueueName(exchangeName), getExchangeCoordinae);
            reject();
        }, 1000);
        unmq.on(getInternalIframeCoordinateQueueName(exchangeName), getExchangeCoordinae);
        function getExchangeCoordinae(messageCoordinate) {
            unmq.off(getInternalIframeCoordinateQueueName(exchangeName), getExchangeCoordinae);
            if (messageCoordinate.random == random) {
                clearTimeout(id);
                resolve(messageCoordinate);
            }
        }
    });
}
