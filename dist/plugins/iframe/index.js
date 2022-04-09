import { Queue } from "../../index";
export function getInternalIframeMessageQueueName(queueName) {
    return queueName + "_Message";
}
export function getInternalIframeCoordinateQueueName(queueName) {
    return queueName + "_Coordinate";
}
var IframeMessage = (function () {
    function IframeMessage(name) {
        this.name = name;
    }
    IframeMessage.prototype.install = function (unmq) {
        var _this = this;
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        var selfExchange = unmq.getExchange(this.name);
        if (!selfExchange) {
            throw this.name + "\u4EA4\u6362\u673A\u4E0D\u5B58\u5728";
        }
        var list = unmq.getExchangeList();
        var otherIframe = list.filter(function (item) { return item.name !== _this.name; });
        for (var name_1 in otherIframe) {
            unmq.addQueue(new Queue({ name: getInternalIframeMessageQueueName(name_1) }));
            unmq.addQueue(new Queue({ name: getInternalIframeCoordinateQueueName(name_1) }));
        }
    };
    return IframeMessage;
}());
export default IframeMessage;
