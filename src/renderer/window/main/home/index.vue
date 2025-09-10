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
                <router-link to="/windowMain/ranking" tag="div" class="ranking" @click="openRanking"></router-link>
                <div class="title">
                    <div class="title_text">发放勋章积分 {{ state.clientHeight }}</div>
                </div>
                <!--  -->
                <div class="list_warper" ref="dataListRef" :key="state.updateKey">
                    <div class="list_item__warper"  :style="{height: state.clientHeight + 'px'}">
                        <div class="list_item" v-for="(item, idx) in state.dataList" :key="idx">
                            <!-- active -->
                            <div class="item_content">
                                <div class="item_content__active">
                                    <CheckOutlined style="color:#fff;font-size: 10px;"/>
                                </div>
                                <div class="item_content__bg">
                                    <span>{{ idx }}枚</span>
                                </div>
                                <div class="ellipsis item_name">李小雨</div>
                            </div>
                        </div>
                    </div>
                    <!--  -->
                    <div class="list_item__warper">
                        <div class="select_desc">已选择3位同学，快给他们发送勋章吧～</div>
                        
                        <div class="list_item__box" :style="{height: (state.clientHeight - 80) + 'px'}">
                            <div class="list_item" v-for="(item, idx) in state.dataList" :key="idx">
                                <!-- active -->
                                <div class="item_content">
                                    <div class="item_content__active">
                                        <CheckOutlined style="color:#fff;font-size: 10px;"/>
                                    </div>
                                    <div class="item_img">
                                        <img src="" alt="">
                                    </div>
                                    <div class="ellipsis item_name">完成{{idx}}次评价</div>
                                </div>
                            </div>
                        </div>

                        <div style="padding-top: 10px;text-align: center;">
                            <a-button type="primary" style="border-radius: 16px;width: 160px;background-color: #00C777;">确定发放</a-button>
                        </div>
                    </div>                    
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue"
import {CheckOutlined ,CaretDownOutlined} from "@ant-design/icons-vue"
import BarTop from '../../../components/BarTop/index.vue'
import { open, stat } from "original-fs"

const dataListRef = ref<HTMLElement | null>(null)
const state = reactive({
    updateKey: 0,
    dataList: [],
    clientHeight:544
})

function openRanking(){
    console.log('openRanking');
}



onMounted(() => {
    if(dataListRef.value){
       state.clientHeight = dataListRef.value.clientHeight
    }

    window.addEventListener('resize', () => {
        state.dataList = []
       state.clientHeight = 0
       state.updateKey++       
       nextTick(()=>{
           state.clientHeight = dataListRef.value?.clientHeight       
           
            state.dataList =  Array.from({ length: 50 }, (_, i) => i + 1)
       })
    })

    nextTick(()=>{
        state.dataList =  Array.from({ length: 50 }, (_, i) => i + 1)
    })
    
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
        padding: 0 20px 20px 20px;

        .content {
            background: #fff;
            border-radius: 8px;
            height: 100%;
            padding: 18px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;

        }

        .ranking {
            width: 100%;
            height: 83px;
            background: url('../../../assets/bg-ranking.png') no-repeat;
            background-size: 100% auto;
            background-position: center;
            cursor: pointer;
            transition: all 0.23s;
            &:hover {               
                transition: all 0.23s;
                background-size: 105% auto;
            }
        }

        .title {
            padding: 10px 0;
            background: #F7F7F7;
            border-radius: 7px;
            text-align: center;
            margin-top: 13px;

            .title_text {
                font-weight: 600;
                font-size: 18px;
                color: #333333;
                position: relative;
                display: inline-block;

                &::before {
                    content: '';
                    width: 52px;
                    height: 18px;
                    background: url('../../../assets/icon-title-lf.png') no-repeat;
                    background-size: contain;
                    position: absolute;
                    left: -65px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                &::after {
                    content: '';
                    width: 52px;
                    height: 18px;
                    background: url('../../../assets/icon-title-rj.png') no-repeat;
                    background-size: contain;
                    position: absolute;
                    right: -65px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }


        .list_warper {
            display: flex;
            flex: 1;
            margin-top: 6px;

            .list_item__warper {
                width: 50%;
                box-sizing: border-box;
                position: relative;

                // padding: 6px;

                &:first-child {
                    padding-right: 6px;
                    padding-top: 6px;
                    padding-left: -6px;
                    overflow-y: scroll;
                    .list_item{
                        &:hover{
                            .item_content{
                                border: 2px solid #FF9433;
                                transition: all 0.23s;
                            }
                            .item_content__active{
                                background-color: #FF9433 !important;
                                transition: all 0.23s;
                            }
                        }
                    }
                }
                &:last-child {
                    &::after{
                        content: " ";
                        position: absolute;
                        top: 19px;
                        left: 0;
                        bottom: 0;
                        width: 1px;
                        background-color: #C9C9C9;
                    }
                    .list_item{
                        &:hover{                            
                            .item_content__active{
                                background-color: #00B781 !important;
                                transition: all 0.23s;
                            }
                        }
                    }      
                    .item_content__active{
                        background-color: #C9C9C9 !important;
                        width: 18px !important;
                        height: 18px !important;
                        border-radius:50% !important;
                    }
                    .item_content{
                        background: none !important;
                    }

                    .select_desc{
                        padding-left: 16px;
                        padding-top: 10px;
                        padding-bottom: 6px;
                        font-size: 13px;
                        color: #333333;
                    }
                }

                .list_item {
                    width: 20%;
                    box-sizing: border-box;
                    display: inline-block;
                    padding: 6px;
                    

                    .item_content {
                        background: linear-gradient(223deg, #FDFAD7 0%, #FCF1AC 100%);
                        border-radius: 8px;
                        height: 80px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        border: 2px solid #fff;
                        overflow: hidden;

                        .item_content__bg{
                            font-size: 13px;
                            color: #000000;
                            width: 53px;
                            height: 53px;
                            background: url('../../../assets/bg-content-nosl.png') no-repeat;
                            background-size: contain;
                            text-align: center;                            
                            line-height: 45px;                            
                        }                       

                        .item_name{
                            text-align: center;
                            font-weight: 400;
                            font-size: 13px;
                            color: #020000;
                            max-width: 80%;                           
                        }
                        .item_content__active{
                            position: absolute;
                            right: 0;
                            top: 0;
                            width: 20px;
                            height: 16px;
                            background: #FAE7AA;
                            border-radius: 0px 0px 0px 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .item_img{
                            width: 58px;
                            height: 58px;
                            margin-bottom: 4px;
                            img{
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                                display: block;
                            }
                        }
                    }
                    

                    .item_content.active{
                        border: 2px solid #FF9433 !important;
                        .item_content__active{
                            background-color: #FF9433 !important;
                        }
                        .item_content__bg{
                             background: url('../../../assets/bg-content-sl.png') no-repeat !important;
                             background-size: contain !important;
                        }
                    }
                }
            }

            .list_item__box{
                padding-left: 12px;
                overflow-y: scroll;
            }
        }


    }
}
</style>