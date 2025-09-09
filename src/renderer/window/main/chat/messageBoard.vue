<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-14 09:37:36
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-14 09:59:42
-->

<template>
    <div class="MessageBord">
        <BarTop />
        <div class="MessageList">
            <MessageItem :data="item" v-for="item in messageStore.data" :key="item.id" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModelChat } from '../../../../model/modelChat'
import { useChatStore } from '../../../store/useChatStore'
import { useMessageStore } from '../../../store/useMessageStore'
import MessageItem from './messageItem.vue'

import BarTop from '../../../components/BarTop/index.vue'

let chatStore = useChatStore()
let messageStore = useMessageStore()
let curId = ''
//订阅Store内数据的变化
chatStore.$subscribe((mutations, state) => {
    let item = state.data.find((v) => v.isSelected) as ModelChat
    if (item.id != curId) {
        messageStore.initData(item)
        curId = item.id
    }
})
</script>

<style scoped lang="less">
    .MessageBord {
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .MessageList {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        background: rgb(245, 245, 245);
    }
</style>