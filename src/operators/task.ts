import { Operator } from "..";

/**
 * task
 * @param count
 * @returns
 */
export function task<D>(count: number): Operator<D> {
  let seen = 0;
  return {
    beforeAddNews() {
      if (++seen <= count) return true;
      return false;
    },
  };
}
