<template>
    <div class="menu_wapper">
        <div class="userIcon">
            <img src="../../assets/avatar.jpg" alt="" />
            
        </div>
        <div class="menu">
            <router-link v-for="item in mainWindowRoutes" :to="item.path" :class="[`menuItem`, { selected: item.isSelected }]">
                <i :class="[`iconfont`, item.isSelected ? item.iconSelected : item.icon]"></i>
                <div>{{item.title}}</div>
            </router-link>
        </div>
        <div class="setting">
            <div class="menuItem" @click="handleSetting">
                <i class="iconfont icon-setting"></i>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { createDialog } from '../../common/dialog'

//菜单列表数组
let mainWindowRoutes = ref([
    {
        path: `/windowMain/chat`,
        isSelected: true,
        icon: `icon-messages`,
        title:"消息",
        iconSelected: `icon-messages`
    },
    {
        path: `/windowMain/todo`,
        isSelected: false,
        icon: `icon-daiban`,
        title:"待办",
        iconSelected: `icon-daiban`
    },
    {
        path: `/windowMain/documents`,  
        isSelected: false,
        icon: `icon-yunwendang`,
        title:"文档",
        iconSelected: `icon-yunwendang`
    },
    {
        path: `/windowMain/calendar`,
        isSelected: false,
        icon: `icon-calendar`,
        title:"日历",
        iconSelected: `icon-calendar`
    },
    
    {
        path: `/windowMain/workbench`,
        isSelected: false,
        icon: `icon-gongzuotai`,
        title:"工作台",
        iconSelected: `icon-gongzuotai`
    },
    {
        path: `/windowMain/collection`,
        isSelected: false,
        icon: `icon-shoucang`,
        title:"收藏",
        iconSelected: `icon-shoucang`
    },
    {
        path: `/windowMain/mailList`,
        isSelected: false,
        icon: `icon-tongxunlu`,
        title:"通讯录",
        iconSelected: `icon-tongxunlu`
    },    
    {
        path: `/windowMain/more`,
        isSelected: false,
        icon: `icon-more_light`,
        title:"更多",
        iconSelected: `icon-more_light`
    }
])
let route = useRoute()
//注册路由变化监听器
watch(
    () => route,
    () =>
        mainWindowRoutes.value.forEach(
            (v) => (v.isSelected = v.path === route.fullPath)
        ),
    {
        immediate: true,
        deep: true
    }
)

async function handleSetting() {
    let config = {     
        width: 620,
        height: 500,
        resizable:false,
        frame: false,        
        webPreferences: {
            
        }
    }

    // window.open(
    //     `/windowSetting/accountSetting`,
    //     '_blank',
    //     JSON.stringify(config)
    // )

    const dialog = await createDialog(
        `/windowSetting/accountSetting`,
        config
    )
    let msg = { msgName: 'hello', value: 'msg from your parent' }
    dialog.postMessage(msg)      

    window.addEventListener('message', (e) => {
        console.log(`来自子窗口的消息`, e.data)
    })
}
</script>

<style scoped lang="less">
    .menu_wapper {
        width: 68px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #f0f0f0;
        -webkit-app-region: drag;
        
    }
    .userIcon {
        height: 50px;
        padding-top: 8px;
        box-sizing: border-box;
        background: #3BA39C;
        img {
            width: 34px;
            height: 34px;
            margin-left: 18px;
            border-radius: 4px;
        }
    }
    .menu {
        flex: 1;
        padding-top: 24px;
        border-right: 1px solid #e6e6e6;
    }
    .menuItem {
        padding: 12px 0;
        text-align: center;        
        display: block;
        text-decoration: none;
        color: #000;
        cursor: pointer;
        -webkit-app-region: no-drag;
        position: relative;
        z-index: 1;
        transition: all 0.25s;
       font-size: 14px;
        i {
            font-size: 20px;
        }
        &:hover {
            color: #3BA39C;

            &::after{
                content: "";            
                position: absolute;  
                left: 6px;
                top:6px;
                right: 6px;
                bottom: 6px;
                background: rgba(0, 0,0,.05);
                border-radius: 4px;
                z-index: -1;
            }
        }
    }
    .selected {
        color:#3BA39C;      
        position: relative;
        z-index: 1;
        transition: all 0.25s;
        &::after{
            content: "";            
            position: absolute;  
            left: 6px;
            top:6px;
            right: 6px;
            bottom: 6px;
            background: rgba(0, 0,0,.05);
            border-radius: 4px;
            z-index: -1;
        }
        
    }
    .setting {
        padding-bottom: 5px;
        border-right: 1px solid #e6e6e6;
    }
</style>