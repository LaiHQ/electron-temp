import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";

import './assets/style.css'


// import { db } from "../common/db";

const pinia = createPinia()

// try {
//     db("Chat").first().then((obj) => {
//         console.log(obj);
//     });
// } catch (error) {
//     console.log(error)    
// }


createApp(App).use(pinia).use(router).mount('#app')
