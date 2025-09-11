<template>
    <div class="container_wapper">
        <BarTop>
            <template #title>
                <div class="logo" />
            </template>
            <template #right>
                <div style="display: flex; align-items: center">
                    <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
                        <div class="current_class">
                            <span class="current_class__name ellipsis">{{
                                selectClass?.showName || selectClass?.name
                                }}</span>
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
                        <div class="current_class" style="margin-right: 30px">
                            <a-avatar size="36" :src="user.avatar" />
                            <CaretDownOutlined style="color: #fff; margin-left: 3px" />
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
                <a-tabs v-model:activeKey="state.activeKey" centered @change="changeTabs">
                    <template #leftExtra>
                        <a-button type="text" @click="openHome">
                            <LeftOutlined style="font-size: 16px; color: #999999" />
                        </a-button>
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
                <div class="list_warper" ref="listRef" :key="state.updateKey">
                    <!-- 列表 -->
                    <div class="list_box" :style="{ height: state.clientHeight + 'px' }" ref="scrollRef"
                        @scroll="handleScroll">
                        <div v-for="(item, index) in state.dataList" :key="index" class="list_item">
                            <div class="left">
                                <div class="number">
                                    <div v-if="[1, 2, 3].includes(index + 1)" :class="`number_icon_${index + 1}`"></div>
                                    <div v-else>{{ index + 1 }}</div>
                                </div>
                                <a-avatar class="avatar" size="32" :src="item.avatar" />
                                <div class="name">{{ item.personName }}</div>
                            </div>
                            <div class="right">
                                <div class="rank_change">
                                    <ArrowUpOutlined style="color: red" />
                                    <ArrowDownOutlined style="color: #00b371" />
                                    <span style="padding-left: 3px">较上周提升{{ item.rankingChange }}名</span>
                                </div>
                                <div class="total_score">{{ item.totalScore }}总积分</div>
                            </div>
                        </div>
                        <!-- 加载状态提示 -->
                        <!---->
                        <div v-if="!hasMore" class="no-more">没有更多数据了!</div>
                    </div>
                    <div v-if="loading" class="loading">
                        <LoadingOutlined /> 加载中...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, createVNode, computed } from "vue";
import { useRouter } from "vue-router";
import {
    LeftOutlined,
    CaretDownOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons-vue";
import BarTop from "../../../components/BarTop/index.vue";
import { Modal, message } from "ant-design-vue";
import {
    ExclamationCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons-vue";
import http from "../../../utils/http";
import { useUserInfoStore } from "../../../store/useStore";
const userInfo = useUserInfoStore();
const user = computed(() => userInfo.getUser);
const classMaterList = computed(() => userInfo.getClassMaterList);
const selectClass = computed(() => userInfo.getCurrentClass);

const listRef = ref(null);
const scrollRef = ref(null);
const router = useRouter();

const loading = ref(false);
const hasMore = ref(true);

const state = reactive({
    activeKey: "1",
    updateKey: 0,
    dataList: [],
    clientHeight: 514,
    pageNo: 1,
});

function openHome() {
    router.push("/windowMain/home");
}

function handleSelectClass(e) {
    // console.log(e.key);
    userInfo.changeCLass(e.key);
}

function handleUserClick(e) {
    if (e.key === "2") {
        Modal.confirm({
            title: "温馨提示",
            icon: createVNode(ExclamationCircleOutlined),
            content: createVNode("div", { style: "color:red;" }, "确定退出登录吗?"),
            cancelText: "取消",
            okText: "确定",
            onOk() {
                // 退出登录
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                router.push("/windowMain/login");
                message.success("安全退出");
            },
            onCancel() { },
        });
    }
}

function changeTabs(activeKey) {
    state.pageNo = 1;
}

async function fetchData(activeKey) {
    if (loading.value || !hasMore.value) return;
    loading.value = true;
    const urlMap = {
        1: `/cloud/evalStatistic/pageEvalPersonScore`,
        2: `/cloud/evalMedal/record/pageMedalRecordCount`,
        3: `/cloud/evalScoreCard/off/pageScoreCardCount`,
    };
    const url = urlMap[activeKey];
    const params = {
        pageNo: state.pageNo,
        pageSize: 15,
        identity: 0,
        classesId: selectClass.value.id,
    };
    http
        .post(url, params)
        .then((res) => {
            const { pageNo, list, pageSize, total } = res.data;
            if (list.length < 10) {
                hasMore.value = false; // 数据不足一页，说明到底了
            }
            state.dataList.push(...list);
            state.pageNo++;
        })
        .finally(() => {
            loading.value = false;
        });
}

let timer = null;
const debounce = (func, delay) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, delay);
};

function handleScroll(e) {
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.value;
    //  console.log(scrollTop, clientHeight, scrollHeight)
    const tolerance = 180;
    if (scrollTop + clientHeight >= scrollHeight - tolerance) {
        // 防抖 + 防止重复加载
        debounce(() => {
            if (!loading.value && hasMore.value) {
                console.log("load");
                fetchData(1);
            }
        }, 300);
    }
}

onMounted(() => {
    if (listRef.value) {
        console.log(listRef.value.clientHeight);
        state.clientHeight = listRef.value.clientHeight;
    }

    window.addEventListener("resize", () => {
        const arr = [...state.dataList]
        state.dataList = [];
        state.clientHeight = 0;
        state.updateKey++;
        nextTick(() => {
            state.clientHeight = listRef.value?.clientHeight;
            state.dataList =  arr
        });
    });

    fetchData(1);
});
</script>

<style scoped lang="less">
.container_wapper {
    display: flex;
    flex-direction: column;

    .logo {
        width: 370px;
        height: 27px;
        background: url("../../../assets/icon-title.png") no-repeat;
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
            color: #ffffff;
            line-height: 54px;
        }

        .switch_class {
            width: 18px;
            height: 18px;
            background: url("../../../assets/icon-switch.png") no-repeat;
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
            display: flex;
            flex-direction: column;

            .banner {
                width: 100%;
                height: 167px;
                margin-top: -16px;
                background-image: url("../../../assets/ranking-banner.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center;
                border-radius: 8px;
                transition: all 0.2s;
            }

            .header {
                display: flex;
                margin-top: -44px;
                background-color: #f7f7f7;
                cursor: pointer;
                border-radius: 11px 11px 0px 0px;
                overflow: hidden;

                .header_item {
                    flex: 1;
                    text-align: center;
                    height: 44px;
                    line-height: 44px;
                    font-weight: 600;
                    font-size: 16px;
                    color: #333333;

                    &__active {
                        background: #ffdecc;
                        color: #ff5100;
                    }

                    &:hover {
                        color: #ff5100;
                    }
                }
            }

            .list_warper {
                flex: 1;
                overflow: hidden;
                position: relative;

                .list_box {
                    overflow-y: scroll;
                    padding: 0 33px;
                    position: relative;

                    .list_item {
                        display: flex;
                        align-items: center;
                        height: 59px;
                        border-bottom: 1px solid #f7f7f7;

                        &:hover {
                            background: #fff4e8;
                        }

                        .left {
                            width: calc(50% - 50px);
                            display: flex;
                            align-items: center;

                            .number {
                                font-size: 16px;
                                color: #999999;
                                width: 34px;
                                height: 35px;
                                text-align: center;
                                line-height: 35px;
                            }

                            .number_icon_1 {
                                width: 100%;
                                height: 100%;
                                background: url("../../../assets/icon-r-one.png") no-repeat;
                                background-size: contain;
                            }

                            .number_icon_2 {
                                width: 100%;
                                height: 100%;
                                background: url("../../../assets/icon-r-two.png") no-repeat;
                                background-size: contain;
                            }

                            .number_icon_3 {
                                width: 100%;
                                height: 100%;
                                background: url("../../../assets/icon-r-three.png") no-repeat;
                                background-size: contain;
                            }

                            .avatar {
                                margin: 0 10px;
                            }

                            .name {
                                font-size: 13px;
                                color: #333333;
                            }
                        }

                        .right {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            .rank_change {
                                font-size: 11px;
                                color: #999999;
                            }

                            .total_score {
                                font-size: 13px;
                                color: #ff5e00;
                            }
                        }
                    }

                    .no-more {
                        text-align: center;
                        padding: 16px 0;
                        font-size: 12px;
                        color: #999999;
                    }
                }

                .loading {
                    text-align: center;
                    padding: 16px 0;
                    font-size: 12px;
                    color: #999999;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #fff;
                }
            }
        }
    }
}
</style>
