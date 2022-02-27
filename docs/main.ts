import { createApp } from "vue";
import App from "./App.vue";
import "@a/css/df.css";

// Router
import { Router } from "./router";

const app = createApp(App);

app.use(Router);

app.mount("#app");
