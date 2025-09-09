<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-14 09:30:11
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2023-05-11 20:08:46
-->
<template>
    <div class="ChatList">
        <!-- <ChatSearch /> -->
        <div class="ListBox">
            <ChatItem :data="item" v-for="item in store.data" :key="item.id" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatStore } from '../../../store/useChatStore'
import ChatItem from './chatItem.vue'
import ChatSearch from './chatSearch.vue'
let store = useChatStore()
onMounted(() => {
    //选中第七个会话
    store.selectItem(store.data[6])
})
</script>


<style scoped lang="less">
    .ChatList {
        width: 250px;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
    }
    .ListBox {
        background: rgb(230, 229, 229);
        background-image: linear-gradient(
            to bottom right,
            rgb(235, 234, 233),
            rgb(240, 240, 240)
        );
        flex: 1;
        overflow-y: auto;
        box-sizing: border-box;

        border-right: 1px solid rgb(214, 214, 214);
    }
</style>