import {createRouter,createWebHistory} from "vue-router";


const routes = [
    { path: "/", redirect: "/windowMain/home" },
    {
        path: "/windowMain",
        component: () => import("../window/main/index.vue"),
        children: [
          { path: "login", component: () => import("../window/main/login/index.vue") },
          { path: "home", component: () => import("../window/main/home/index.vue") },
          { path: "ranking", component: () => import("../window/main/ranking/index.vue") },
        ],
      },
      {
        path: "/windowSetting",
        component: () => import("../window/setting/index.vue"),
        children: [
            { path: "accountSetting", component: () => import("../window/setting/accountSetting.vue") }
        ],
      },     
]



const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router