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
                            <span class="current_class__name ellipsis">{{ selectClass?.showName ||
                                selectClass?.name }}</span>
                            <div class="switch_class"></div>
                        </div>
                        <template #overlay>
                            <a-menu @click="handleSelectClass" v-if="classMaterList.length">
                                <a-menu-item :key="item.id" v-for="(item, idx) in classMaterList">
                                    <a href="javascript:;"
                                        :style="{ color: item.id == selectClass.id ? '#00B781' : '' }">{{
                                            item.showName || item.name }}</a>
                                </a-menu-item>
                            </a-menu>
                            <!--  -->
                        </template>
                    </a-dropdown>
                    <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
                        <div class="current_class" style="margin-right: 30px;">
                            <a-avatar size="36" v-if="user.avatar" :src="user.avatar" />
                            <a-avatar size="36" v-else style="background: none;">
                                <template #icon>
                                    <img src="../../../assets/pic-head.png" alt="">
                                </template>
                            </a-avatar>
                            <CaretDownOutlined style="color: #fff;margin-left: 3px;" />
                        </div>
                        <template #overlay>
                            <a-menu @click="handleUserClick">
                                <a-menu-item key="1">
                                    <a href="javascript:;">
                                        {{ user.name }}
                                        <br />
                                        <span>{{ user.phone }}</span>
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
                    <div class="title_text">发放勋章积分</div>
                </div>
                <!--  -->
                <div class="list_warper" ref="dataListRef" :key="state.updateKey">

                    <div class="list_item__warper" :style="{ height: state.clientHeight + 'px' }">
                        <a-spin :spinning="spinningStudent">
                            <div class="list_item" :style="{
                                width: `${state.clientWidth > 1200 ? 16.6 : 25}%`
                            }" v-for="(item, idx) in state.dataList" :key="idx" @click="handleSelectStudent(item)">
                                <div class="item_content" :class="{
                                    active: state.checkedStudentList.includes(item.id)
                                }">
                                    <div class="item_content__active">
                                        <CheckOutlined style="color:#fff;font-size: 10px;" />
                                    </div>
                                    <div class="item_content__bg">
                                        <span>{{ item.medalCount || 0 }}枚</span>
                                    </div>
                                    <div class="ellipsis item_name">{{ item.name }}</div>
                                </div>
                            </div>
                            <!--  -->
                            <a-empty :image-style="{
                                height: '160px',
                                marginTop: '100px'
                            }" v-if="state.dataList.length == 0 && !spinningStudent">
                                <template #image>
                                    <img src="../../../assets/empty.png" alt="">
                                </template>
                                <template #description>
                                    <span>
                                        暂无数据！
                                        <a href="javascript:;" @click="getAllStudents">重新加载</a>
                                    </span>
                                </template>
                            </a-empty>
                        </a-spin>
                    </div>

                    <!--  -->
                    <div class="list_item__warper">
                        <a-spin :spinning="spinningMedal">
                            <div style="padding: 0 12px;">
                                <a-tabs v-model:activeKey="currentMedalType" @change="changeTabs">
                                    <a-tab-pane key="-1" tab="全部"></a-tab-pane>
                                    <a-tab-pane :key="item.id" :tab="item.name"
                                        v-for="item in evalMedalType"></a-tab-pane>
                                </a-tabs>
                            </div>

                            <div class="list_item__box" :style="{ height: (state.clientHeight - 100) + 'px' }">
                                <div class="list_item" :style="{
                                    width: `${state.clientWidth > 1200 ? 16.6 : 25}%`
                                }" v-for="(item, idx) in state.evalMedalList" :key="idx"
                                    @click="handleSelectMedal(item)">
                                    <!--  -->
                                    <div class="item_content" :class="{
                                        active: state.checkedMedalList.includes(item.id)
                                    }">
                                        <div class="item_content__active">
                                            <CheckOutlined style="color:#fff;font-size: 10px;" />
                                        </div>
                                        <div class="item_img disabled-drag">
                                            <img :src="item.medalIconUrl" alt="">
                                        </div>
                                        <div class="ellipsis item_name">{{ item.medalName }}</div>
                                    </div>
                                </div>
                                <a-empty :image-style="{
                                    height: '160px',
                                    marginTop: '100px'
                                }" v-if="state.evalMedalList.length == 0 && !spinningMedal">
                                    <template #image>
                                        <img src="../../../assets/empty.png" alt="">
                                    </template>
                                    <template #description>
                                        <span>
                                            暂无数据！
                                            <a href="javascript:;" @click="getPageEvalMedal(currentMedalType)">重新加载</a>
                                        </span>
                                    </template>
                                </a-empty>
                            </div>

                            <div
                                style="padding-top: 10px;display: flex;align-items: center;justify-content: space-between;">
                                <div class="select_desc ellipsis">已选择 <span style="font-size: 16px;color:#F5222D">{{
                                    state.checkedStudentList.length
                                        }}</span> 位同学，快给他们发送勋章吧～</div>

                                <div style="display: flex;align-items: center;">
                                    <a-button @click="clearCheck" :disabled="!(state.checkedStudentList.length > 0 || state.checkedMedalList.length > 0)" style="border-radius: 16px;">重置</a-button>
                                    <a-popconfirm :disabled="!(state.checkedStudentList.length > 0 && state.checkedMedalList.length > 0)" title="确定发放?" @confirm="submit">
                                        <a-button
                                            :disabled="!(state.checkedStudentList.length > 0 && state.checkedMedalList.length > 0)"
                                            :loading="subLoading" type="primary"
                                            style="border-radius: 16px;width: 160px;margin-left: 11px;">确定发放</a-button>
                                    </a-popconfirm>
                                </div>

                            </div>
                        </a-spin>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--  -->
    <!-- <StartUpdate /> -->
    <!--  -->
</template>

<script setup>

import { nextTick, onMounted, reactive, ref, createVNode, computed, watch } from "vue"
import { CheckOutlined, CaretDownOutlined, WarningOutlined } from "@ant-design/icons-vue"
import BarTop from '../../../components/BarTop/index.vue'
import router from "../../../router"
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

import { useUserInfoStore } from "../../../store/useStore"
import http from "../../../utils/http";
// import StartUpdate from "../../../components/startUpdate/index.vue"




const userInfo = useUserInfoStore()
const user = computed(() => userInfo.getUser)
const classMaterList = computed(() => userInfo.getClassMaterList)
const selectClass = computed(() => userInfo.getCurrentClass)
const evalMedalType = computed(() => userInfo.getEvalMedalType)

const currentMedalType = computed({
    get() {
        return userInfo.getCurrentMedalType?.id
    },
    set(key) {
        userInfo.changeMedalType(key)
    }
})

const dataListRef = ref(null)
const spinningStudent = ref(true)
const spinningMedal = ref(true)
const subLoading = ref(false)
const state = reactive({
    updateKey: 0,
    dataList: [],
    clientHeight: 544,
    clientWidth: 1000,
    evalMedalList: [],
    checkedStudentList: [],
    checkedMedalList: [],

})

// https://app.apifox.com/project/2934512

let timer = null;
const debounce = (func, delay) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, delay);
};

function changeTabs(id) {
    debounce(() => {
        getPageEvalMedal(id)
    }, 300)
}




function openRanking() {
    console.log('openRanking');
}

function submit() {
    subLoading.value = true
    const personListDTO = state.dataList.filter(i => state.checkedStudentList.includes(i.id)).map(i => {
        return {
            id: i.id,
            name: i.name,
            identity: 0,
            typeValue: 'student'
        }
    })
    const medalCodeList = state.evalMedalList.filter(i => state.checkedMedalList.includes(i.id)).map(i => i.medalCode)
    const p = {
        medalCodeList,
        personListDTO
    }
    message.config({
        top: `100px`
    })
    http.post(`/app/appEvalMedal/person/issuanceMedal`, p).then(res => {
        if (res.data) {
            state.checkedStudentList = []
            state.checkedMedalList = []
            getAllStudents()
        }
        message.success(res.message)
    }).finally(() => {
        subLoading.value = false
    })
}

function clearCheck(){
    state.checkedStudentList = []
    state.checkedMedalList = []
}



function handleSelectStudent({ id }) {
    const idx = state.checkedStudentList.findIndex(i => id == i)
    if (idx >= 0) {
        state.checkedStudentList.splice(idx, 1)
    } else {
        state.checkedStudentList.push(id)
    }
}

function handleSelectMedal({ id }) {
    const idx = state.checkedMedalList.findIndex(i => id == i)
    if (idx >= 0) {
        state.checkedMedalList.splice(idx, 1)
    } else {
        state.checkedMedalList.push(id)
    }
}

function getPageEvalMedal(id) {
    spinningMedal.value = true
    const p = {
        issuanceMethod: 2,
        medalList: [],
        medalStatus: 1,
        pageNo: 1,
        pageSize: 999,
        medalTypeId: id || currentMedalType.value
    }

    if (p.medalTypeId == '-1') {
        delete p.medalTypeId
    }
    http.post('/cloud/evalMedal/pageEvalMedal', p).then(res => {
        const { list } = res.data
        state.evalMedalList = list
    }).finally(() => {
        spinningMedal.value = false
    })
}


function getAllStudents() {
    if (!selectClass.value?.id) {
        spinningStudent.value = false
        message.warning('查询学生失败，未获取到相关班级数据！')
        return
    }

    spinningStudent.value = true
    http.post(`/cloud/student/allStudents`, {
        id: selectClass.value.id,
        type: '4',
        key: '',
        queryMedal: true,
        pageNo: 1,
        pageSize: 10
    }).then(res => {
        console.log('res', res)
        state.dataList = res.data
    }).finally(() => {
        spinningStudent.value = false
    })
}

function handleSelectClass(e) {
    // console.log(e.key);
    userInfo.changeCLass(e.key)
    getAllStudents()
}


function handleUserClick(e) {
    if (e.key === '2') {
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
                // 
                userInfo.clearUserInfo()
                router.push('/windowMain/login')
                message.success('安全退出')
            },
            onCancel() {

            }
        });
    }
}
// watch(()=>selectClass.value?.id,()=>{
//     // 获取学生
//     getAllStudents()
//     //
// })

onMounted(async () => {
    if (dataListRef.value) {
        state.clientHeight = dataListRef.value?.clientHeight
        state.clientWidth = dataListRef.value?.clientWidth
    }
    window.addEventListener('resize', () => {
        const arr = [...state.dataList]
        const arr1 = [...state.evalMedalList]
        state.dataList = []
        state.evalMedalList = []
        state.clientHeight = 0
        state.clientWidth = 0
        state.updateKey++
        nextTick(() => {
            state.clientHeight = dataListRef.value?.clientHeight
            state.clientWidth = dataListRef.value?.clientWidth
            state.dataList = arr
            state.evalMedalList = arr1
        })
    })

    await userInfo.queryClassMaterList(() => {
        spinningStudent.value = false
        spinningMedal.value = false
    })

    nextTick(() => {
        getAllStudents()

        userInfo.queryPageEvalMedalType((id) => {
            getPageEvalMedal(id)
        }).catch(() => {
            spinningMedal.value = false
        })

        
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

    .current_class {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        height: 25px;

        .current_class__name {
            font-size: 14px;
            color: #FFFFFF;
            line-height: 54px;
            max-width: 240px;
        }

        .switch_class {
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

                    // .list_item {
                    //     &:hover {
                    //         .item_content {
                    //             border: 2px solid #FF9433;
                    //             transition: all 0.23s;
                    //         }

                    //         .item_content__active {
                    //             background-color: #FF9433 !important;
                    //             transition: all 0.23s;
                    //         }
                    //     }
                    // }

                    .item_content.active {
                        border: 2px solid #FF9433 !important;

                        .item_content__active {
                            background-color: #FF9433 !important;
                        }

                        .item_content__bg {
                            background: url('../../../assets/bg-content-sl.png') no-repeat !important;
                            background-size: contain !important;
                        }
                    }
                }

                &:last-child {
                    &::after {
                        content: " ";
                        position: absolute;
                        top: 19px;
                        left: 0;
                        bottom: 0;
                        width: 1px;
                        background-color: #C9C9C9;
                    }

                    // .list_item{
                    //     &:hover{                            
                    //         .item_content__active{
                    //             background-color: #00B781 !important;
                    //             transition: all 0.23s;
                    //         }
                    //     }
                    // }    
                    .item_content.active {
                        .item_content__active {
                            background-color: #00B781 !important;
                            transition: all 0.23s;
                        }
                    }

                    .item_content__active {
                        background-color: #C9C9C9 !important;
                        width: 18px !important;
                        height: 18px !important;
                        border-radius: 50% !important;
                    }

                    .item_content {
                        background: none !important;
                    }

                    .select_desc {
                        padding-left: 16px;
                        // padding-top: 10px;
                        // padding-bottom: 6px;
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

                        .item_content__bg {
                            font-size: 13px;
                            color: #000000;
                            width: 53px;
                            height: 53px;
                            background: url('../../../assets/bg-content-nosl.png') no-repeat;
                            background-size: contain;
                            text-align: center;
                            line-height: 45px;
                        }

                        .item_name {
                            text-align: center;
                            font-weight: 400;
                            font-size: 13px;
                            color: #020000;
                            max-width: 80%;
                        }

                        .item_content__active {
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

                        .item_img {
                            width: 58px;
                            height: 58px;
                            margin-bottom: 4px;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                                display: block;
                            }
                        }
                    }



                }
            }

            .list_item__box {
                padding-left: 12px;
                overflow-y: scroll;
            }
        }
    }

    :deep(.ant-spin-spinning) {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
    }

    :deep(.ant-tabs-nav) {
        margin-bottom: 0 !important;
    }
}
</style>