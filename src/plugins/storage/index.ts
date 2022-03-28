/**
 *
 *
 *
 */
type StorageOption = {
  type: "session" | "local";
};
type StorageData = Record<string, StorageOption>;
class StoragePlugin {
  constructor(storageData: StorageData) {
    new Proxy(storageData, {
      get: function (target, propKey, receiver) {
        return Reflect.get(target, propKey, receiver);
      },
      set: function (target, propKey, value, receiver) {
        return Reflect.set(target, propKey, value, receiver);
      },
    });
  }
  store: null;
}
import PiniaStorageAdapter from "@/adapter/piniaStorageAdapter";

const sp = new StoragePlugin({
  userId: { type: "session" },
});
