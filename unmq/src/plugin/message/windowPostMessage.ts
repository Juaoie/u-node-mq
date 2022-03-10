export function getIframeNode(id?: string, origin?: string) {
  if (self === top) {
    findIfameNodeById(Array.from(window), id, origin);
  }
}

/**
 * 没写完啊，碎觉呀
 * @param windowList 
 * @param id 
 * @param origin 
 * @returns 
 */
function findIfameNodeById(windowList: Window[], id?: string, origin?: string) {
  const arr = [];
  for (const w of windowList) {
    if (id === undefined && origin === undefined) {
      arr.push(...findIfameNodeById(Array.from(w), id, origin));
    } else if (id === undefined && origin !== undefined) {
      if (origin === w.origin) arr.push(...findIfameNodeById(Array.from(w), id, origin));
    }
  }
  return arr;
}
