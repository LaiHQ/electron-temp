<template>
    <div class="container_wapper">
         <BarTop>
            <template #title>
                <div class="logo" />
            </template>
            <template #right>
                <div style="display: flex;align-items: center;">                   
                    <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
                        <div class="current_class">
                           <span class="current_class__name ">三年级2班</span>
                            <div class="switch_class"></div>
                        </div>                        
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                <a href="javascript:;">1st menu item</a>
                                </a-menu-item>
                                <a-menu-item>
                                <a href="javascript:;">2nd menu item</a>
                                </a-menu-item>
                                <a-menu-item>
                                <a href="javascript:;">3rd menu item</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
                        <div class="current_class" style="margin-right: 30px;">
                           <a-avatar size="36" src="https://www.antdv.com/assets/logo.1ef800a8.svg" />
                           <CaretDownOutlined style="color: #fff;"/>
                        </div>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a href="javascript:;">
                                        张三
                                        <br/>
                                        <span>18320782675</span>
                                    </a>
                                </a-menu-item>                               
                                <a-menu-item>
                                    <a href="javascript:;">退出登录</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </template>
        </BarTop>
        <div class="content_warper">
            <div class="content">
                <a-tabs v-model:activeKey="state.activeKey" centered>
                    <template #leftExtra>
                        <a-button type="text" @click="openHome"><LeftOutlined style="font-size: 16px;color: #999999;"/></a-button>
                    </template>
                    <a-tab-pane key="1" tab="积分"></a-tab-pane>
                    <a-tab-pane key="2" tab="勋章"></a-tab-pane>
                    <a-tab-pane key="3" tab="积分卡"></a-tab-pane>
                </a-tabs>
                <div class="banner"></div>
                <div class="header">
                    <div class="header_item header_item__active">全校排名</div>
                    <div class="header_item">本班排名</div>
                </div>
                <div class="list_warper" ref="listRef" :key="state.updateKey" >
                    <!-- 列表 -->
                    <div class="list_box" :style="{ height: state.clientHeight + 'px' }">
                        <div v-for="(item, index) in state.dataList" :key="index" class="list_item">
                            <div class="left">
                                <div class="number">
                                    <div v-if="[1, 2, 3].includes(index + 1)" :class="`number_icon_${index + 1}`">
                                    </div>
                                    <div v-else>{{ index + 1 }}</div>
                                </div>
                                <a-avatar class="avatar" size="32" src="https://www.antdv.com/assets/logo.1ef800a8.svg" />
                                <div class="name">张三</div>
                            </div>
                            <div class="right">
                                <div class="rank_change">
                                    <ArrowUpOutlined style="color: red;"/>
                                    <ArrowDownOutlined style="color: #00B371;"/>
                                    <span style="padding-left: 3px;">较上周提升2名</span>
                                </div>
                                <div class="total_score">
                                    444总积分
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue"
import { useRouter } from "vue-router"
import {LeftOutlined ,CaretDownOutlined,ArrowUpOutlined,ArrowDownOutlined} from "@ant-design/icons-vue"
import BarTop from '../../../components/BarTop/index.vue'
import { open } from "original-fs"
const listRef = ref<HTMLElement | null>(null)
const router = useRouter()
const state = reactive({
    activeKey:'1',
    updateKey:0,
    dataList: [],
    clientHeight: 514
})

function openHome(){
    router.push('/windowMain/home')
}

onMounted(() => {
    if(listRef.value){
       console.log(listRef.value.clientHeight);
       state.clientHeight = listRef.value.clientHeight  
    }

    window.addEventListener('resize', () => {
       state.dataList = []
       state.clientHeight = 0
       state.updateKey++
       nextTick(()=>{        
            state.clientHeight = listRef.value?.clientHeight           
           
           state.dataList =  Array.from({ length: 50 }, (_, i) => i + 1)
       })
    })

    state.dataList =  Array.from({ length: 50 }, (_, i) => i + 1)
})


</script>

<style scoped lang="less">
.container_wapper {
    display: flex;
    flex-direction: column;

     .logo {
        width: 370px;
        height: 27px;
        background: url('../../../assets/icon-title.png') no-repeat;
        background-size: contain;
    }
    .current_class{
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        height: 25px;
        .current_class__name{
            font-size: 16px;
            color: #FFFFFF;
            line-height: 54px;
        }

        .switch_class{
            width: 18px;
            height: 18px;            
            background: url('../../../assets/icon-switch.png') no-repeat;
            background-size: contain;
            margin: 0 13px;
        }
    }

    .content_warper {
        flex: 1;
        box-sizing: border-box;
        padding:0 20px 20px 20px;

        .content {
            background: #fff;
            border-radius: 8px;
            height: 100%;
            display: flex;
            flex-direction: column;

            .banner{
                width: 100%;
                height: 167px;
                margin-top: -16px;
                background-image: url('../../../assets/ranking-banner.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center;
                border-radius: 8px;
                transition: all 0.2s;
            }
            .header{
                display: flex;                
                margin-top: -44px;
                background-color: #F7F7F7;
                cursor: pointer;
                border-radius: 11px 11px 0px 0px;
                overflow: hidden;
                .header_item{
                    flex: 1;
                    text-align: center;
                    height: 44px;
                    line-height: 44px;
                    font-weight: 600;
                    font-size: 16px;
                    color: #333333;                    
                    &__active{
                        background: #FFDECC;
                        color: #FF5100;
                    }
                    &:hover{
                        color: #FF5100;                    }
                }
            }

            .list_warper{
                flex: 1; 
                overflow: hidden;
                .list_box{
                    overflow-y: scroll;
                    padding: 0 33px;
                    .list_item{
                        display: flex;
                        align-items: center;
                        height: 59px;
                        border-bottom: 1px solid #F7F7F7;
                        &:hover{
                            background: #FFF4E8;
                        }
                        .left{
                            width: calc(50% - 50px);
                            display: flex;
                            align-items: center;
                            .number{
                                font-size: 16px;
                                color: #999999;
                                width: 34px;
                                height: 35px;
                                text-align: center;
                                line-height: 35px;
                            }
                            .number_icon_1{
                                width: 100%;
                                height: 100%;
                                background: url('../../../assets/icon-r-one.png') no-repeat;
                                background-size: contain;                               
                            }
                            .number_icon_2{
                                width: 100%;
                                height: 100%;
                                background: url('../../../assets/icon-r-two.png') no-repeat;
                                background-size: contain;                               
                            }
                            .number_icon_3{
                                width: 100%;
                                height: 100%;
                                background: url('../../../assets/icon-r-three.png') no-repeat;
                                background-size: contain;                               
                            }
                            .avatar{
                                margin: 0 10px;
                            }
                            .name{
                                font-size: 13px;
                                color: #333333;
                            }
                        }
                        .right{
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            .rank_change{
                                font-size: 11px;
                                color: #999999;
                            }
                            .total_score{
                                font-size: 13px;
                                color: #FF5E00;
                            }
                        }
                    }
                }
            }
        }


    }
}
</style>