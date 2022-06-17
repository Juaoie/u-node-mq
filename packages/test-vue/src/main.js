import Vue from "vue";
import App from "./App.vue";
import router from "./router";
//导入滚动组件
import vuescroll from "vuescroll/dist/vuescroll-native";
import "vuescroll/dist/vuescroll.css";
Vue.use(vuescroll);
//导入wx基础工具方法
import ws from "./utils/ws";
Vue.use(ws);
//导入ui框架
import "./assets/css/index.css";
import Element from "element-ui";
Vue.use(Element, { size: "small", zIndex: 3000 });

Vue.config.productionTip = false;

import "./assets/css/df.css";
import "./assets/css/animate.css";
import store from "./store";
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
}).$mount("#app");
