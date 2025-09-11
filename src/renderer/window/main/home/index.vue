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
                           <span class="current_class__name ellipsis">{{selectClass?.showName || selectClass?.name}}</span>
                            <div class="switch_class"></div>
                        </div>                        
                        <template #overlay>
                            <a-menu @click="handleSelectClass">
                                <a-menu-item :key="item.id" v-for="(item, idx) in classMaterList">
                                    <a href="javascript:;">{{ item.showName || item.name }}</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
                        <div class="current_class" style="margin-right: 30px;">
                           <a-avatar size="36" :src="user.avatar" />
                           <CaretDownOutlined style="color: #fff;margin-left: 3px;"/>
                        </div>
                        <template #overlay>
                            <a-menu  @click="handleUserClick">
                                <a-menu-item key="1"> 
                                    <a href="javascript:;">
                                        {{user.name}}
                                        <br/>
                                        <span>{{user.phone}}</span>
                                    </a>
                                </a-menu-item>
                                <a-menu-item key="2">
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
                                    <span>{{ item.medalCount || 0 }}枚</span>
                                </div>
                                <div class="ellipsis item_name">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                    <!--  -->
                    <div class="list_item__warper">
                        <div class="select_desc">已选择3位同学，快给他们发送勋章吧～</div>
                        
                        <div class="list_item__box" :style="{height: (state.clientHeight - 80) + 'px'}">
                            <div class="list_item" v-for="(item, idx) in state.evalMedalList" :key="idx">
                                <!-- active -->
                                <div class="item_content">
                                    <div class="item_content__active">
                                        <CheckOutlined style="color:#fff;font-size: 10px;"/>
                                    </div>
                                    <div class="item_img">
                                        <img :src="item.medalIconUrl" alt="">
                                    </div>
                                    <div class="ellipsis item_name">{{item.medalName}}</div>
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

<script setup>
import {nextTick, onMounted, reactive, ref,createVNode, computed,watch} from "vue"
import {CheckOutlined ,CaretDownOutlined} from "@ant-design/icons-vue"
import BarTop from '../../../components/BarTop/index.vue'
import router from "../../../router"
import { Modal,message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

import {useUserInfoStore} from "../../../store/useStore"
import http from "../../../utils/http";
const userInfo = useUserInfoStore()
const user = computed(()=> userInfo.getUser)
const classMaterList = computed(()=> userInfo.getClassMaterList)
const selectClass =  computed(()=>userInfo.getCurrentClass)

const dataListRef = ref(null)
const state = reactive({
    updateKey: 0,
    dataList: [],
    clientHeight:544,
    evalMedalList:[]
})

// https://app.apifox.com/project/2934512

function openRanking(){
    console.log('openRanking');
}

function getPageEvalMedal(){
    http.post('/cloud/evalMedal/pageEvalMedal',{
        issuanceMethod: 2,
        medalList: [],
        medalStatus: 1,
        pageNo: 1,
        pageSize: 999
    }).then(res=>{
        const {list }  =  res.data
        state.evalMedalList = list
    })
}


function getAllStudents(){
    http.post(`/cloud/student/allStudents`,{
        id:selectClass.value.id,
        type:'4',
        key:'',
        queryMedal:true,
        pageNo:1,
        pageSize:10
    }).then(res=>{
        console.log('res',res)
        state.dataList = res.data
    }).finally(()=>{
        
    })
}

function handleSelectClass(e){
    // console.log(e.key);
    userInfo.changeCLass(e.key)
    getAllStudents()
}


function handleUserClick(e){
    if(e.key === '2'){
        Modal.confirm({
            title: '温馨提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: createVNode('div', { style: 'color:red;' }, '确定退出登录吗?'),
            cancelText: '取消',
            okText: '确定',
            onOk() {
                // 退出登录
                localStorage.removeItem('token')
                localStorage.removeItem('refresh_token')
                router.push('/windowMain/login')
                message.success('安全退出')
            },
            onCancel() {
                
            }
        });
    }
}
watch(()=>selectClass.value?.id,()=>{
    // 获取学生
    getAllStudents()
    //
})


onMounted(() => {
    if(dataListRef.value){
       state.clientHeight = dataListRef.value.clientHeight
    }

    window.addEventListener('resize', () => {
       const arr = [...state.dataList]
       state.dataList = []
       state.clientHeight = 0
       state.updateKey++
       nextTick(()=>{
           state.clientHeight = dataListRef.value?.clientHeight           
            state.dataList =  arr
       })
    })

    nextTick(()=>{
        userInfo.queryClassMaterList()
        
        getPageEvalMedal()
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
            font-size: 14px;
            color: #FFFFFF;
            line-height: 54px;
            max-width: 240px;
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