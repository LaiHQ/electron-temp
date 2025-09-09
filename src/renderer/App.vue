<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-12 15:58:44
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2023-08-23 22:15:46
-->


<template>
    <router-view />
</template>

<script setup lang="ts">
import { version } from '../../package.json'

console.log(version)
// import { onMounted, reactive } from 'vue'

// // import mac from 'getmac'

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
// onMounted(() => {

// })
</script>

<style scoped>
</style>
