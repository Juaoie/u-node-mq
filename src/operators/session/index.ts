import { Operator } from "../../index";
/**
 * sessionStorage 将队列数据存入sessionStorage
 * @returns
 */

export default function session<D = unknown>(): Operator<D> {
  let name = "";
  return {
    mounted(that) {
      if (!sessionStorage) throw "sessionStorage 为空";
      name = that.name || "null";
      const d = sessionStorage.getItem(name);
      if (d !== null) that.pushContent(JSON.parse(d));
    },
    addedNews(news) {
      if (!sessionStorage) throw "sessionStorage不存在";
      sessionStorage.setItem(name, JSON.stringify(news.content));
    },
  };
}
