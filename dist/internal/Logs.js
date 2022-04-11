export default class Logs {
    static error(message) {
        console.error(message);
    }
    static log(message) {
        console.log(message);
    }
}
Logs.unmq = null;
