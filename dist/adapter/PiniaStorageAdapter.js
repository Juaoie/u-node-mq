var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import StorageAdapterAbstract from "../plugins/storage/StorageAdapterAbstract";
var VueStorageAdapter = (function (_super) {
    __extends(VueStorageAdapter, _super);
    function VueStorageAdapter(storeDefinition) {
        var _this = _super.call(this) || this;
        _this.storeDefinition = storeDefinition;
        return _this;
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
}(StorageAdapterAbstract));
export default VueStorageAdapter;
