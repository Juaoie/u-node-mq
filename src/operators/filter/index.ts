import { Operator, News } from "../..";

/**
 * filter 过滤
 * @param fun
 * @returns boolean 返回值控制是否加入队列
 */
export default function filter<D>(fun: (res: D) => boolean | Promise<boolean>): Operator<D> {
  return {
    beforeAddNews(res: News<D>) {
      return fun(res.content);
    },
  };
}
