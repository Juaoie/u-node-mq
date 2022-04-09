import { isPromise } from "../index.js";
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
                    _this.consume(news.content, null, _this.payload);
                    return thenParameter(true);
                }
                var confirm_1 = function (value) {
                    if (value === void 0) { value = true; }
                    return thenParameter(value);
                };
                var res = _this.consume(news.content, confirm_1, _this.payload);
                if (isPromise(res)) {
                    res
                        .then(function (onfulfilled) {
                        thenParameter(Boolean(onfulfilled));
                    })
                        .catch(function () {
                        thenParameter(false);
                    });
                }
                else if (typeof res === "boolean") {
                    confirm_1 = function () { };
                    thenParameter(res);
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
