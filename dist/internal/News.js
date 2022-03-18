import Tools from "../utils/tools.js";
var News = (function () {
    function News(content) {
        this.id = Tools.random();
        this.consumedTimes = -1;
        this.createTime = new Date().getTime();
        this.content = content;
    }
    News.prototype.getId = function () {
        return this.id;
    };
    return News;
}());
export default News;
