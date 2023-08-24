import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'

import NaiveUi from "naive-ui";
const app = createApp(App);
app.use(NaiveUi)
app.mount('#app')