var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
        arr.push.apply(arr, __spreadArray([], __read(getAllIframeDoc(w[k], x, y)), false));
        x += 1;
    }
    return arr;
}
