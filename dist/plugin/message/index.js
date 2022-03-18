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
import { Exchange, Queue, News } from "@/index";
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
