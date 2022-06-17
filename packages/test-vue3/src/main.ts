import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import '@a/css/df.css'
const app = createApp(App)

app.use(router)

app.mount('#app')
