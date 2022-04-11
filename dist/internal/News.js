import Tools from "../utils/tools.js";
export default class News {
    constructor(content) {
        this.id = Tools.random();
        this.consumedTimes = -1;
        this.createTime = new Date().getTime();
        this.content = content;
    }
    getId() {
        return this.id;
    }
}
