export function getOtherAllIframeDoc() {
    if (window.top === null)
        throw "window.top is null";
    const list = getAllIframeDoc(window.top, 0, 0);
    return list.filter((item) => item.window !== window.self);
}
export function getSelfIframeDoc() {
    if (window.top === null)
        throw "window.top is null";
    const list = getAllIframeDoc(window.top, 0, 0);
    return list.find((item) => item.window === window.self);
}
export function getAllIframeDoc(w, x, y) {
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
