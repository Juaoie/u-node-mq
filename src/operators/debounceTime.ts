import { Operator } from "..";
import Tools from "../utils/tools";

/**
 * debounceTime 防抖函数
 * @param dueTime 抖动间隔时间，单位毫秒
 * @param immediate 是否立即执行，一般不用立即执行
 * @returns
 */
export function debounceTime<D>(dueTime: number, immediate?: boolean): Operator<D> {
  let now: number = 0;
  let timeId: number | null = null;
  let res: (value: boolean | PromiseLike<boolean>) => void;
  return {
    beforeAddNews() {
      const t = new Date().getTime();
      if (immediate) {
        //立即执行
        const n = now;
        now = t;
        return t > n + dueTime;
      } else {
        //
        if (timeId !== null && t <= now + dueTime) {
          res(false);
          clearTimeout(timeId);
        }
        now = t;
        return new Promise((resolve) => {
          res = resolve;
          timeId = setTimeout(() => {
            timeId = null;
            resolve(true);
          }, dueTime);
        });
      }
    },
  };
}
