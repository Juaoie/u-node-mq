import { Operator, News } from "..";

/**
 * filter 过滤
 * @param fun
 * @returns
 */
export function filter<D>(fun: (res: any) => boolean | Promise<boolean>): Operator<D> {
  return {
    beforeAddNews(res: News<D>) {
      return fun(res.content);
    },
  };
}
