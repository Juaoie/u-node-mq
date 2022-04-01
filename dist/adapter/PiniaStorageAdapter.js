var VueStorageAdapter = (function () {
    function VueStorageAdapter(storeDefinition) {
        this.storeDefinition = storeDefinition;
    }
    VueStorageAdapter.prototype.getData = function (key) {
        var store = this.storeDefinition();
        return store[key];
    };
    VueStorageAdapter.prototype.setData = function (key, value) {
        var store = this.storeDefinition();
        store[key] = value;
    };
    return VueStorageAdapter;
}());
export default VueStorageAdapter;
