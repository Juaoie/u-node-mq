var StoragePlugin = (function () {
    function StoragePlugin(storageData) {
        new Proxy(storageData, {
            get: function (target, propKey, receiver) {
                return Reflect.get(target, propKey, receiver);
            },
            set: function (target, propKey, value, receiver) {
                return Reflect.set(target, propKey, value, receiver);
            },
        });
    }
    return StoragePlugin;
}());
export {};
