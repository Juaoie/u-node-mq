import { Operator } from "../..";
import { IntTime } from "../../utils/types";

/**
 * debounceTime 防抖函数
 * @param dueTime 抖动间隔时间，单位毫秒
 * @param immediate 是否立即执行，默认为false
 * @returns
 * 立即执行代表第一个回调函数会立马执行，防抖函数一般不需要立即执行
 */
export default function debounceTime<D = unknown>(dueTime: number, immediate?: boolean): Operator<D> {
  let now = 0;
  let timeId: IntTime | null = null;
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
        return new Promise(resolve => {
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
