var Tools = (function () {
    function Tools() {
    }
    Tools.random = function () {
        return String(Math.round(Math.random() * 10000000000));
    };
    Tools.getTimeFormat = function (time) {
        var now = null;
        if (time)
            now = new Date(time);
        else
            now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hh = now.getHours();
        var mm = now.getMinutes();
        var clock = year + '-';
        if (month < 10)
            clock += '0';
        clock += month + '-';
        if (day < 10)
            clock += '0';
        clock += day + ' ';
        if (hh < 10)
            clock += '0';
        clock += hh + ':';
        if (mm < 10)
            clock += '0';
        clock += mm;
        return clock;
    };
    Tools.promiseSetTimeout = function (time) {
        if (time === void 0) { time = 0; }
        return new Promise(function (resolve) { return setTimeout(resolve, time); });
    };
    Tools.memorySize = function (str) {
        var totalLength = 0;
        var charCode;
        for (var i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength++;
            }
            else if (0x0080 <= charCode && charCode <= 0x07ff) {
                totalLength += 2;
            }
            else if (0x0800 <= charCode && charCode <= 0xffff) {
                totalLength += 3;
            }
            else {
                totalLength += 4;
            }
        }
        if (totalLength >= 1024 * 1024)
            return (totalLength / (1024 * 1024)).toFixed(2) + 'MB';
        if (totalLength >= 1024 && totalLength < 1024 * 1024)
            return (totalLength / 1024).toFixed(2) + 'KB';
        else
            return totalLength + 'B';
    };
    return Tools;
}());
export default Tools;
