<template>
  <a-config-provider
  :locale="zh_CN"
    :theme="{
      token: {
        colorPrimary: '#00B781',
      },
    }"
  >
    <router-view />
  </a-config-provider>  
</template>

<script setup lang="ts">
import zh_CN from "ant-design-vue/es/locale/zh_CN"
import { onMounted } from "vue"
// import { ipcRenderer } from 'electron'
// import path from 'path'
// import { version } from '../../package.json';
// import { createDialog } from './common/dialog';
// let dialog: any
// const VITE_BASE_ENV = import.meta.env.MODE
// console.log(version)

// const state = reactive({
//     mac: ''
// })
// const Database = require('better-sqlite3')

// const db = new Database('db.db', {
//     verbose: console.log,
//     nativeBinding:
//         './node_modules/better-sqlite3/build/Release/better_sqlite3.node'
// })

// console.log('bb--', db)

// async function updateApp(data?: any) {
//   let config = {
//     modal: true,
//     width: 500,
//     height: 350,
//     resizable: false,
//     movable: true,
//     hasShadow: false,
//     title: '升级',
//     icon: path.join(process.cwd(), '/resources/icons/icon.ico'),
//     webPreferences: { webviewTag: false },
//   }

//   if (dialog) {
//     dialog.postMessage(data || {})
//     return false
//   }
//   dialog = await createDialog(`/windowSetting/update`, config)
//   dialog.postMessage(data || {})
//   window.addEventListener('message', e => {
//     console.log(`来自子窗口的消息`, e.data)
//     // if (e.data.value == 'noUpdate') {
//     //     // 如果model 为modal  dialog.close()
//     //     dialog.close()
//     // }
//     // if (e.data.value == 'update') {
//     // }
//   })
// }


onMounted(() => {
  // ipcRenderer.on('updateApp', (e, data) => {
  //   updateApp(data)
  // })
  // ipcRenderer.send('UpdaterCheck', VITE_BASE_ENV)
  console.log('app onMounted')
})
</script>

<style scoped>



</style>
