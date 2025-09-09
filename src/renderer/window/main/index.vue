<template>

    <!-- <div class="container_wapper"> -->
    <!-- <BarTop /> -->
    <router-view />
    <!-- </div> -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ipcRenderer } from 'electron'

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