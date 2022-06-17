// vuex.d.ts
import { Store } from "vuex";
import { State } from "./state";

declare module "@vue/runtime-core" {
  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
