var VueStorageAdapter = (function () {
    function VueStorageAdapter(store) {
        this.store = store;
    }
    VueStorageAdapter.prototype.getData = function (key) {
        return this.store[key];
    };
    VueStorageAdapter.prototype.setData = function (key, value) {
        this.store[key] = value;
    };
    return VueStorageAdapter;
}());
export default VueStorageAdapter;
