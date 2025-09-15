<template></template>

<script setup>
import { ipcRenderer } from 'electron'

import path from 'path'
import { createDialog } from '../../common/dialog';
import { onMounted } from 'vue';
const VITE_BASE_ENV = import.meta.env.MODE
let dialog;
async function updateApp(data) {
    const config = {
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

onMounted(()=>{
    setTimeout(()=>{
            ipcRenderer.on('updateApp', (e, data) => {
              updateApp(data)
            })
            ipcRenderer.send('UpdaterCheck', VITE_BASE_ENV)            
        },3000)
})
</script>

