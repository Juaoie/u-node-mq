export function getIframeNodeFromCoordinate(coordinate) {
    var list = getAllIframeDoc(window.top, 0, 0);
    var w = list.find(function (item) { return item.x === coordinate.x && item.y === coordinate.y; });
    if (w === undefined)
        return null;
    return w.window;
}
export function getOtherAllIframeDoc() {
    var list = getAllIframeDoc(window.top, 0, 0);
    return list.filter(function (item) { return item.window !== window.self; });
}
export function getSelfIframeDoc() {
    var list = getAllIframeDoc(window.top, 0, 0);
    return list.find(function (item) { return item.window === window.self; });
}
export function getAllIframeDoc(w, x, y) {
    var arr = [];
    arr.push({
        window: w,
        x: x,
        y: y,
    });
    y += 1;
    for (var k = 0; k < w.length; k++) {
        arr.push.apply(arr, getAllIframeDoc(w[k], x, y));
        x += 1;
    }
    return arr;
}
