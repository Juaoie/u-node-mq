var Logs = (function () {
    function Logs() {
    }
    Logs.error = function (message) {
        console.error(message);
    };
    Logs.log = function (message) {
        console.log(message);
    };
    Logs.unmq = null;
    return Logs;
}());
export default Logs;
