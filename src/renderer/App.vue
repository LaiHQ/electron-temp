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
// import { version } from '../../package.json'

// console.log(version)
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
