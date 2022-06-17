import { createStore, createLogger, Store, useStore as baseUseStore } from "vuex";
import { state, State } from "./state";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { InjectionKey } from "vue";

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore({
  state,
  getters,
  actions,
  mutations,
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key);
}
