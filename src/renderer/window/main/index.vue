<template>

    <!-- <div class="container_wapper"> -->
    <!-- <BarTop /> -->
    <router-view />
    <!-- </div> -->
</template>

<script setup>
import { onMounted } from 'vue'
import { ipcRenderer } from 'electron'

import path from 'path'
import { createDialog } from '../../common/dialog';
const VITE_BASE_ENV = import.meta.env.MODE

let dialog;

async function updateApp(data) {
    let config = {
        modal: true,
        width: 500,
        height: 350,
        resizable: false,
        movable: true,
        hasShadow: false,
        title: '升级',
        icon: path.join(process.cwd(), '/resources/icons/icon.ico'),
        webPreferences: { webviewTag: false },
    }
    if (dialog) {
        console.log('------', dialog)
        dialog.postMessage(data || {})
        return false
    }

    dialog = await createDialog(`/windowSetting/update`, config)    
    dialog.postMessage(data || {})
    window.addEventListener('message', e => {
        console.log(`来自子窗口的消息`, e.data)
        if (e.data.value == 'noUpdate') {
            // 如果model 为modal  dialog.close()
            dialog.close()
        }
        if (e.data.value == 'update') {
        }
    })
}

onMounted(() => {
    ipcRenderer.invoke('showWindow')

    setTimeout(()=>{
        ipcRenderer.on('updateApp', (e, data) => {
          updateApp(data)
        })
        ipcRenderer.send('UpdaterCheck', VITE_BASE_ENV)
        ipcRenderer.on('updateAppAuto', (e, data) => {
          console.log('收到更新消息:', data);
          // 检查是否有错误
          if (data.type === 'error') {
            console.error('更新出错:', data.data?.message);
            return;
          }
        });
    },3000)    
})
</script>

<style>
    .container_wapper {
        flex: 1;
        height: 100%;

        box-sizing: border-box;
    }
</style>