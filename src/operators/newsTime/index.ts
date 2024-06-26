import { Operator } from "../..";
import News from "../../internal/News";

/**
 * newsTime 设置消息存活时长
 * @param time 存活时长毫秒数
 * @returns
 */
export default function newsTime<D>(time: number): Operator<D> {
  return {
    ejectNews(news: News<any>) {
      return new Date().getTime() < time + news.createdTime;
    },
  };
}
