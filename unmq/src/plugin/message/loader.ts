import { Coordinate } from "./coordinate";

/**
 * 饼平化方便取值
 * 但是需要标记每个window在多维数组中的位置
 * window为第一层，记为0，0
 * window下第一个iframe记为0，1
 * y 是深度
 *
 * x 是索引
 *
 * 只要有一个window产生就全局核对坐标点
 * 只要有一个IframeMessage被创建则代表当前创建了一个window
 *
 *
 */

/**
 * 根据坐标获取节点
 * @param coordinate
 */
export function getIframeNodeFromCoordinate(coordinate: Pick<Coordinate, "x" | "y">): Window {
  const list = getAllIframeDoc(window.top, 0, 0);
  const w = list.find(item => item.x === coordinate.x && item.y === coordinate.y);
  if (w === undefined) return null;
  return w.window;
}

type T = {
  window: Window;
  x: number;
  y: number;
};
export function getAllIframeDoc(w: Window, x, y): T[] {
  const arr = [];
  arr.push({
    window: w,
    x,
    y,
  });
  y += 1;
  for (let k = 0; k < w.length; k++) {
    arr.push(...getAllIframeDoc(w[k], x, y));
    x += 1;
  }
  return arr;
}
