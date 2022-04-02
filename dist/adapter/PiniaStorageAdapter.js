import { defineStore } from "pinia";
var VueStorageAdapter = (function () {
    function VueStorageAdapter() {
    }
    VueStorageAdapter.prototype.init = function (o) {
        this.storeDefinition = defineStore("__storage", {
            state: function () { return o; },
        });
    };
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
