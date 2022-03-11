/**
 * 饼平化方便取值
 * 但是需要标记每个window在多维数组中的位置
 * window为第一层，记为0，0
 * window下第一个iframe记为1，0
 *
 * 只要有一个window产生就全局核对坐标点
 * 只要有一个IframeMessage被创建则代表当前创建了一个window
 *
 *
 */
export function getIframeNode(excludeSelf: boolean) {
  const iframeList = getAllIframeDoc(top, 0, 0);
  if (excludeSelf) return iframeList.filter(item => item !== self);
  else return iframeList;
}

export function getAllIframeDoc(w: Window, x, y) {
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
