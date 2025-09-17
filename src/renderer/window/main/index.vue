<template>

    <!-- <div class="container_wapper"> -->
    <!-- <BarTop /> -->
    <router-view />    
    <!-- </div> -->
</template>

<script setup>
import { onMounted,h } from 'vue'
import { ipcRenderer } from 'electron'

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';

function createChangelogElement(data, h) {
  const lines = data.releaseNotes
    .split('\r\n') // 按 \r\n 分割
    .map(line => line.trim()) // 去除每行首尾空格
    .filter(line => line); // 过滤空行
  const paragraphElements = lines.map(line => h('p', line));  
  return h('div', {}, [h('p',`新版本 v:${data.version} 已下载完成。重启应用以完成安装。`),...paragraphElements]);
}

const showConfirm = (data) => {
  Modal.confirm({
    title: `应用更新`,
    icon: createVNode(ExclamationCircleOutlined),
    content:  createChangelogElement(data,h),
    okText:"重启",
    cancelText:"稍后",
    onOk() {
       ipcRenderer.invoke('update-version');
    },
    onCancel() {
      // ipcRenderer.invoke('closeWindow');
    },
  });
};

onMounted(() => {
    ipcRenderer.invoke('showWindow')
    setTimeout(()=>{
        ipcRenderer.on('updateApp', (e, data) => {
            if(data.type == 'updateDownloadedEnd'){
                showConfirm(data.data)
            }
        })
        ipcRenderer.send('UpdaterCheck', import.meta.env.MODE)
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