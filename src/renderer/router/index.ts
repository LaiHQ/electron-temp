import {createRouter,createWebHistory} from "vue-router";

const routes = [
    { path: "/", redirect: "/windowMain/login" },
    {
        path: "/windowMain",
        component: () => import("../window/main/index.vue"),
        children: [
          { path: "login", name:"login", component: () => import("../window/main/login/index.vue") },
          { path: "home", name:"home",component: () => import("../window/main/home/index.vue") },
          { path: "ranking",name:"ranking", component: () => import("../window/main/ranking/index.vue") },
        ],
      },
      {
        path: "/windowSetting",
        component: () => import("../window/setting/index.vue"),
        children: [
            { path: "update",name:"update",component: () => import("../window/setting/update.vue") }
        ],
      },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});


const whiteList: string[] = ["login"]
router.beforeEach(async (to, from, next) => {
    if (localStorage.getItem("token")) {
        if (to.path === "/windowMain/login") {
            next({ path: "/windowMain/home" })
        } else {
            next()
        }
    }else{
       if (whiteList.includes(to.name as string)) {
            next()
        } else {
            next({ path: "/windowMain/login", query: { redirect: to.fullPath } })            
        }
    }
})

export default router