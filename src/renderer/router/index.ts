/*
 * @Date: 2023-05-11 19:55:52
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2023-05-11 20:25:14
 * @FilePath: \apph5f:\code\HuaQiang\src\renderer\router\index.ts
 */
/*
 * @Descripttion: 路由配置
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-13 09:45:09
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2023-05-11 20:13:15
 */

import {createRouter,createWebHistory} from "vue-router";


const routes = [
    { path: "/", redirect: "/windowMain/chat" },
    {
        path: "/windowMain",
        component: () => import("../window/main/index.vue"),
        children: [
          { path: "chat", component: () => import("../window/main/chat/index.vue") },
          { path: "contact", component: () => import("../window/main/contact/index.vue") },      

          { path: "todo", component: () => import("../window/main/todo/index.vue") },
          { path: "documents", component: () => import("../window/main/documents/index.vue") },
          { path: "calendar", component: () => import("../window/main/calendar/index.vue") },
          { path: "workbench", component: () => import("../window/main/workbench/index.vue") },
          { path: "collection", component: () => import("../window/main/collection/index.vue") },
          { path: "mailList", component: () => import("../window/main/mailList/index.vue") },
          { path: "more", component: () => import("../window/main/more/index.vue") },
        ],
      },
      {
        path: "/windowSetting",
        component: () => import("../window/setting/index.vue"),
        children: [
            { path: "accountSetting", component: () => import("../window/setting/accountSetting.vue") }
        ],
      },
      {
        path: "/windowUserInfo",
        component: () => import("../window/userInfo/index.vue"),
      },
]



const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router