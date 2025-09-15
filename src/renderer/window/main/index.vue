<template>

    <!-- <div class="container_wapper"> -->
    <!-- <BarTop /> -->
    <router-view />    
    <!-- </div> -->
</template>

<script setup>
import { onMounted } from 'vue'
import { ipcRenderer } from 'electron'




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