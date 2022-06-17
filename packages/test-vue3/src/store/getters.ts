import { State } from "./state";
export const getters = {
  /**
   * 获取最大值
   * @param state
   * @returns
   */
  zIndexMax(state: State) {
    return Math.max(...state.runAppList.map((item) => item.style.zIndex), 100);
  },
  /**
   * 获取随即左
   * @param state
   */
  getRandomLeft(state: State) {
    const leftList = state.runAppList.map((item) => item.style.left).sort();
    const clientWidth = document.body.clientWidth;

    // leftList.forEach(left=>{
    //   if(left <)

    // })
  },
};
