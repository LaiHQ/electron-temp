<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-13 09:59:03
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-14 10:02:21
-->
<template>
    <BarLeft />

    <!-- <div class="container_wapper"> -->
    <!-- <BarTop /> -->
    <router-view />
    <!-- </div> -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ipcRenderer } from 'electron'

import BarLeft from '../../components/BarLeft/index.vue'

// import BarTop from '../../components/BarTop/index.vue'

onMounted(() => {
    ipcRenderer.invoke('showWindow')
})
</script>

<style>
    .container_wapper {
        flex: 1;
        height: 100%;

        box-sizing: border-box;
    }
</style>