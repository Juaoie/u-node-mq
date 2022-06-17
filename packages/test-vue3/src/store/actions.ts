import { State } from "./state";
import { ActionContext } from "vuex";
export const actions = {
  /**
   * 设置
   * @param context
   * @param runApp
   */
  async updateRunApp(context: ActionContext<State, any>, runAppId: number) {
    const runApp = context.state.runAppList.find((item) => item.id === runAppId);
    if (runApp !== undefined) await updateRunApp(runApp);
  },
  /**
   * 添加
   * @param context
   */
  async addRunApp(context: ActionContext<State, any>, runApp: RunAppReq) {
    await addRunApp(runApp);
    const runAppList = await getRunAppList();
    context.commit("setRunAppList", runAppList);
  },
  /**
   * 删除
   * @param context
   * @param runAppId
   */
  async deleteRunApp(context: ActionContext<State, any>, runAppId: number) {
    await deleteRunApp({ id: runAppId });
    context.commit(
      "setRunAppList",
      context.state.runAppList.filter((item) => item.id !== runAppId)
    );
  },
};
