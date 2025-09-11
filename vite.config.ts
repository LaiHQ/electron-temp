import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import { devPlugin, getReplacer } from "./plugins/devPlugin";
import { buildPlugin } from "./plugins/buildPlugin";

import optimizer from "vite-plugin-optimizer";
import path from "path";

import {
  AndDesignVueResolve,
} from "vite-plugin-style-import";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver as AntDesignVueComp } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  console.log("mode", mode);
  return {
    css: {
      // modules: {
      //   localsConvention: "camelCase",
      // },
      preprocessorOptions: {
        less: {
          modifyVars: {
            // "primary-color": "#00B781", // 全局主色
            // "link-color": "#1890ff", // 链接色
            // "success-color": "#00B781", // 成功色
            // "warning-color": "#faad14", // 警告色
            // "error-color": "#f5222d", // 错误色
            // "font-size-base": "14px", // 主字号
            // "heading-color": "rgba(0, 0, 0, 0.85)", // 标题色
            // "text-color": "#000000D9", // 主文本色
            // "text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
            // "disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
            // "suggestive-color": "#00000073", // 提示性文字
            // "border-radius-base": "4px", // 组件/浮层圆角
            // "border-color-base": "#d9d9d9", // 边框色
            // "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)", // 浮层阴影.
            // "body-background": "#ffffff", // 白色
            // "gray-background": "#F6F6F6", // 灰色背景
            // "acitve-background": "#00B78114", // 选中颜色
            // "picker-basic-cell-hover-with-range-color": "#dff7ec",
          },
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      optimizer(getReplacer()),
      devPlugin(),
      vue(),      
      Components({
        resolvers: [
          AntDesignVueComp({
            importStyle: false,
          }),          
        ],
      }),
    ],
    build: {
      rollupOptions: {
        plugins: [buildPlugin()],
      },
    },
  };
});
