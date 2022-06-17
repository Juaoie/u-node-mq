import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import "@a/css/df.css";
import { store, key } from "@/store";
const app = createApp(App);

app.use(router);
app.use(store, key);

app.mount("#app");
