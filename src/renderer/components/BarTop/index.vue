<template>
    <div class="topBar">
        <div class="winTitle">
            <slot name="title">{{ title }}</slot>
        </div>
        <div class="winTool">            
            <div @click="minimizeMainWindow" title="最小化">
                <i class="iconfont icon-zuixiaohua" />
            </div>           
            <template v-if="!hideMaximized">
                <div v-if="isMaximized" @click="unmaximizeMainWindow" title="向下还原">
                    <i class="iconfont icon-window-restore" />
                </div>
                <div v-else @click="maxmizeMainWin" title="最大化">
                    <i class="iconfont  icon-square" />
                </div>
            </template>
            <div @click="closeWindow" title="关闭">
                <i class="iconfont icon-close" />
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { ipcRenderer } from 'electron'
defineProps<{ title?: string, hideMaximized?:boolean }>()
let isMaximized = ref(false)

let isTop = ref(false)

let closeWindow = () => {
    ipcRenderer.invoke('closeWindow')
}
let maxmizeMainWin = () => {
    ipcRenderer.invoke('maxmizeWindow')
}
let minimizeMainWindow = () => {
    ipcRenderer.invoke('minimizeWindow')
}
let unmaximizeMainWindow = () => {
    ipcRenderer.invoke('unmaximizeWindow')
}
let winMaximizeEvent = () => {
    isMaximized.value = true
}
let winUnmaximizeEvent = () => {
    isMaximized.value = false
}

const topping = () => {
    ipcRenderer.invoke('topping').then(top=>{            
        isTop.value = top
    }) 

    
}

onMounted(() => {
    ipcRenderer.on('windowMaximized', winMaximizeEvent)
    ipcRenderer.on('windowUnmaximized', winUnmaximizeEvent)
})
onUnmounted(() => {
    ipcRenderer.off('windowMaximized', winMaximizeEvent)
    ipcRenderer.off('windowUnmaximized', winUnmaximizeEvent)
})
</script>

<style scoped lang="less">
    .topBar {
        display: flex;        
        justify-content: space-between;
        align-items: center;
        height: 53px;
        line-height: 53px;
        -webkit-app-region: drag;
        width: 100%;
        // border-bottom: 1px solid #e6e6e6;       
    }
    .winTitle {
        // flex: 1;
        padding-left: 20px;
        // font-size: 14px;
        // color: #fff;
        display: flex;
        align-items: center;
    }
    .search{
        background: rgba(0, 0,0,.08);
        display: flex;
        align-items: center;
        width: 300px;
        // border: 1px solid #e2e2e2b5;
        height: 28px;
        border-radius: 4px;
        .search_icon{
            padding-left: 12px;
            color: #eee;
        }
        .input{
            -webkit-app-region: no-drag;
            flex: 1;
            margin-right: 8px;
            height: 24px;
            line-height: 24px;            
            box-sizing: border-box;
            overflow: hidden;                      
            outline: none;
            padding-left: 12px;
            font-size: 12px;
            padding-right: 6px;
            font-family: 'Microsoft Yahei', -apple-system, Ubuntu, sans-serif;
            color: #fff;
          
            /* 输入框为空时显示 placeholder */
            &:empty:before {
                content: attr(placeholder);
                color: #eee;
            }
            /* 输入框获取焦点时移除 placeholder */
            &:focus:before {
                content: none;
            }
        }
    }
    .winTool {
        height: 100%;
        display: flex;
        -webkit-app-region: no-drag;
        padding-right: 12px;
    }
    .winTool div {
        height: 100%;
        width: 34px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        line-height: 50px;
    }
    .winTool .icon {
        font-size: 10px;
        color: #666666;
        font-weight: bold;
    }
    .winTool div{       
        position: relative;
        &:hover {           
            z-index: 1;
            transition: all 0.25s;
            &::after{
                content: "";            
                position: absolute;  
                left:2px;
                top:8px;
                right: 2px;
                bottom: 8px;
                background: rgba(0, 0,0,.05);
                border-radius: 4px;
                z-index: -1;
            }
        }


    }
    .winTool div:last-child:hover {
        // background: #ff7875;
    }
    .winTool div:last-child:hover i {
        color: #fff !important;
    }

    .winTool .isTop{
        color:red;
        padding: 8px;
        background: rgba(0, 0,0,.05);
    }
</style>
