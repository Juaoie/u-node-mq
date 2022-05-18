import { Operator } from "..";
/**
 * debounceTime 防抖函数
 * @param dueTime 抖动间隔时间，单位毫秒
 * @returns
 */
export function debounceTime<D>(dueTime: number): Operator<D> {
  let now: number | null = null;
  return {
    beforeAddNews() {
      const t = new Date().getTime();
      if (now === null) {
        now = t;
        return true;
      }

      if (now + dueTime < t) {
        now = t;
        return true;
      } else {
        now = t;
        return false;
      }
    },
  };
}
