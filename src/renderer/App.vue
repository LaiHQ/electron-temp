<template>
  <a-config-provider :locale="zh_CN" :theme="{
    token: {
      colorPrimary: '#00B781',
    },
  }">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import zh_CN from "ant-design-vue/es/locale/zh_CN"
import { onMounted, onUnmounted } from "vue"
import { ipcRenderer } from 'electron'

import { useUserInfoStore } from "./store/useStore"
const userInfo = useUserInfoStore()

// const Database = require('better-sqlite3')

// const db = new Database('db.db', {
//     verbose: console.log,
//     nativeBinding:
//         './node_modules/better-sqlite3/build/Release/better_sqlite3.node'
// })

// console.log('bb--', db)


const winMaximizeEvent = () => {
  userInfo.changeMaximized(true)
}
const winUnmaximizeEvent = () => {
  userInfo.changeMaximized(false)
}

onMounted(() => { 
  ipcRenderer.on('windowMaximized', winMaximizeEvent)
  ipcRenderer.on('windowUnmaximized', winUnmaximizeEvent)
})

onUnmounted(() => {
  ipcRenderer.off('windowMaximized', winMaximizeEvent)
  ipcRenderer.off('windowUnmaximized', winUnmaximizeEvent)
})

</script>

<style scoped></style>
