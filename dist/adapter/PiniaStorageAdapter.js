import { defineStore } from "pinia";
export default class VueStorageAdapter {
    init(o) {
        this.storeDefinition = defineStore("__storage", {
            state: () => o,
        });
    }
    getData(key) {
        const store = this.storeDefinition();
        return store[key];
    }
    setData(key, value) {
        const store = this.storeDefinition();
        store[key] = value;
    }
}
