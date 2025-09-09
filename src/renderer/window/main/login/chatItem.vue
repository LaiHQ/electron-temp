<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-14 09:31:31
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-14 09:45:13
-->
<template>
    <div @click="itemClick(data)" :class="['chatItem', { chatItemSelected: data.isSelected }]">
        <div class="avatar">
            <img :src="data.avatar" alt="" />
        </div>
        <div class="chatInfo">
            <div class="row">
                <div class="fromName">{{ data.fromName }}</div>
                <div class="timeName">{{ data.sendTime }}</div>
            </div>
            <div class="row">
                <div class="lastMsg">{{ data.lastMsg }}</div>
                <div class="subscribe"></div>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ModelChat } from '../../../../model/modelChat'
import { useChatStore } from '../../../store/useChatStore'
defineProps<{ data: ModelChat }>()
let store = useChatStore()
let itemClick = (item: ModelChat) => {
    //选中当前会话
    store.selectItem(item)
}
</script>



<style scoped lang="less">
    .chatItem {
        display: flex;
        height: 66px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
            background: rgb(221, 219, 218);
        }
    }
    .chatItemSelected {
        background: rgb(196, 196, 196);
        &:hover {
            background: rgb(196, 196, 196);
        }
    }
    .avatar {
        width: 66px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 46px;
            height: 46px;
        }
    }
    .chatInfo {
        flex: 1;
        height: 66px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .row {
        box-sizing: border-box;
        height: 28px;
        line-height: 28px;
        display: flex;
    }
    .fromName {
        flex: 1;
    }
    .timeName {
        color: rgb(153, 153, 153);
        padding-right: 12px;
        font-size: 12px;
    }
    .lastMsg {
        color: rgb(153, 153, 153);
        flex: 1;
        font-size: 12px;
    }
</style>