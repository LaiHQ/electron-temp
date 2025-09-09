import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";

import './assets/style.css'

import Antd, { message } from 'ant-design-vue'


// import { db } from "../common/db";

const pinia = createPinia()

// try {
//     db("Chat").first().then((obj) => {
//         console.log(obj);
//     });
// } catch (error) {
//     console.log(error)    
// }

const app = createApp(App)
app.config.globalProperties.$message = message

app.use(Antd)
app.use(pinia).use(router).mount('#app')
