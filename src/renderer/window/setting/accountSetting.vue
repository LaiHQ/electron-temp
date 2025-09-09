<template>
    <BarTop title="设置" hideMaximized/>
    <div class="settingBody">
        <div class="menuBox">
            <div class="menuItem">账号设置</div>
            <div class="menuItem">消息通知</div>
            <div class="menuItem">通用设置</div>
            <div class="menuItem">文件管理</div>
            <div class="menuItem">快捷键</div>
            <div class="menuItem">关于微信</div>
        </div>
        <div class="pageBox">
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import BarTop from '../../components/BarTop/index.vue'

import { dialogReady } from '../../common/dialog'

let msgHandler = (e: any) => {
    console.log('来自父窗口的消息：', e.data)
    window.opener.postMessage({ msgName: 'hello', value: 'I am your son.' })
}

onMounted(() => {
    console.log('ready', Date.now())
    window.addEventListener('message', msgHandler)
    dialogReady()
})
</script>

<style lang="less">
    #app {
        flex-direction: column;
        background: rgb(245, 245, 245);
        box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
        box-sizing: border-box;
        border: 1px solid rgb(227, 227, 227);
    }
</style>
<style scoped lang="less">
    .settingBody {
        display: flex;
        flex: 1;
        box-sizing: border-box;
    }
    .menuBox {
        width: 120px;
        border-right: 1px solid rgb(227, 227, 227);
        padding-top: 50px;
        .menuItem {
            height: 32px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            &:hover{
                color: red;
            }
        }
    }
    .pageBox {
        flex: 1;
    }
</style>

