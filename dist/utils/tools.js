export default class Tools {
    static random() {
        return String(Math.round(Math.random() * 10000000000));
    }
    static getTimeFormat(time) {
        let now = null;
        if (time)
            now = new Date(time);
        else
            now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hh = now.getHours();
        const mm = now.getMinutes();
        let clock = year + '-';
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
    }
}
Tools.promiseSetTimeout = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));
Tools.memorySize = (str) => {
    let totalLength = 0;
    let charCode;
    for (let i = 0; i < str.length; i++) {
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
