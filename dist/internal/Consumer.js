import Tools from "../utils/tools.js";
import Logs from "./Logs.js";
var Consumer = (function () {
    function Consumer(consume, payload) {
        this.id = Tools.random();
        this.createTime = new Date().getTime();
        this.consume = consume;
        this.payload = payload;
    }
    Consumer.prototype.getId = function () {
        return this.id;
    };
    Consumer.prototype.consumption = function (news, ask) {
        var _this = this;
        var then = function (thenParameter) {
            try {
                if (!ask) {
                    _this.consume(news.content, _this.payload);
                    return thenParameter(true);
                }
                var confirm_1 = function (value) {
                    if (value === void 0) { value = true; }
                    return thenParameter(value);
                };
                var res = _this.consume(news.content, confirm_1, _this.payload);
                if (res instanceof Promise) {
                    res
                        .then(function (onfulfilled) {
                        thenParameter(onfulfilled);
                    })
                        .catch(function () {
                        thenParameter(false);
                    });
                }
                else {
                    thenParameter(Boolean(res));
                }
            }
            catch (error) {
                Logs.error("Consumer consumption error");
                thenParameter(false);
            }
        };
        return {
            then: then,
        };
    };
    return Consumer;
}());
export default Consumer;
