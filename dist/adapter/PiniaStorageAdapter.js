var VueStorageAdapter = (function () {
    function VueStorageAdapter(storeDefinition) {
        this.storeDefinition = storeDefinition;
    }
    VueStorageAdapter.prototype.getData = function (key) {
        var __store = this.storeDefinition();
        return __store[key];
    };
    VueStorageAdapter.prototype.setData = function (key, value) {
        var __store = this.storeDefinition();
        __store[key] = value;
    };
    return VueStorageAdapter;
}());
export default VueStorageAdapter;
