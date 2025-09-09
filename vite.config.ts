import { defineConfig,loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'

import { devPlugin,getReplacer } from "./plugins/devPlugin"
import { buildPlugin } from "./plugins/buildPlugin";

import optimizer from "vite-plugin-optimizer";





// https://vitejs.dev/config/
export default  defineConfig(({ command, mode, ssrBuild }) => {
    // const env = loadEnv(mode, process.cwd(), '')
    console.log("mode",mode)
    return {
      plugins: [optimizer(getReplacer()), devPlugin(),vue()],
      build: {
        rollupOptions: {
              plugins: [buildPlugin()],
          },
      },
    }
})
