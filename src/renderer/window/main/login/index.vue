<template>
    <div class="container_wapper">
        <BarTop />
        <div class="content_warper">
            <div class="content">
                <!--  -->
                <div class="title">欢迎登录课堂评价</div>
                <div class="subtitle">大家一起互帮互评共提升</div>
                <!--  -->
                <div class="login_warper">
                    <div class="login_img_warper disabled-drag">
                        <img class="login_img" src="../../../assets/login-bg.png" alt="">
                    </div>
                    <!--  -->
                    <div v-if="state.step == 1" class="login_form_warper">
                        <!-- change -->
                        <div class="change-type " @click="changeLoginType">
                            <img class="change-type-img  disabled-drag" v-if="state.loginType === 'pwd'"
                                src="../../../assets/icon-qrcode.png" alt="">
                            <img class="change-type-img disabled-drag" v-else src="../../../assets/icon-erweima.png"
                                alt="">
                        </div>
                        <!-- pwd -->
                        <div class="login-pwd" v-if="state.loginType === 'pwd'">
                            <div class="login-pwd-title">账号登录</div>
                            <a-form style="padding: 21px 22px 0 22px;" :model="formState" name="basic"
                                autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                                <a-form-item name="username" :rules="[{ required: true, message: '账号不能为空!' }]">
                                    <a-input v-model:value="formState.username" placeholder="请输入账号" />
                                </a-form-item>

                                <a-form-item name="password" :rules="[{ required: true, message: '密码不能为空!' }]">
                                    <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
                                </a-form-item>
                                <a-form-item>
                                    <a-button :loading="state.loading" type="primary" html-type="submit"
                                        style="width: 100%;margin-top: 16px;">登录</a-button>
                                </a-form-item>
                            </a-form>
                        </div>
                        <!-- qr code -->
                        <div class="login-qrcode" v-else>
                            <div class="login-pwd-title">扫码登录</div>
                            <div style="display: flex;margin-top: 20px;justify-content: center;">
                                <div style="position: relative;">
                                    <view class="scan-corner top-left"></view>
                                    <view class="scan-corner top-right"></view>
                                    <view class="scan-corner bottom-left"></view>
                                    <view class="scan-corner bottom-right"></view>
                                    <a-qrcode :value="state.qrcode" :size="110" :bordered="false"
                                        :status="state.qrcodeStatus" @refresh="generateQrCode" />
                                </div>
                            </div>
                            <div style="text-align: center;font-size: 12px;color: #666666;padding-top: 20px;">请用手机扫码登录
                            </div>
                        </div>
                    </div>
                    <!--  -->
                    <div v-if="state.step == 2" class="login_form_warper">
                        <div class="login-pwd">
                            <div class="login-pwd-title">选择学校</div>

                            <div style="padding: 21px 20px 0 20px;">
                                <!--  -->
                                <div class="select-warp">
                                    <swiper class="swiper-container" :slides-per-view="3" :space-between="20"
                                        :centered-slides="true" @slideChange="onSlideChange" @swiper="onSwiper"
                                        navigation :scrollbar="{ draggable: true }">
                                        <swiper-slide @click="instanceSwiper?.slideToLoop(idx)" class="swiper-slide"
                                            v-for="(item, idx) in state.schoolList" :key="idx" v-slot="{ isActive }">
                                            <img :src="item.schoolLogo" :style="{
                                                width: '55px',
                                                height: '55px',
                                                borderRadius: '50%',
                                                opacity: isActive ? 1 : 0.5
                                            }" alt="">
                                            <span :style="{
                                                'padding-top': '7px',
                                                'color': isActive ? '#000000' : '#8C8C8C'
                                            }" class="ellipsis school-name">{{ item.schoolName }}</span>
                                        </swiper-slide>
                                    </swiper>
                                    <!--  -->
                                    <div class="prev" @click="changeSchool('prev')">
                                        <img src="../../../assets/left-prev.png" alt="">
                                    </div>
                                    <!--  -->
                                    <div class="next" @click="changeSchool('next')">
                                        <img src="../../../assets/left-next.png" alt="">
                                    </div>
                                </div>
                                <!--  -->
                                <a-button type="primary" style="width: 100%;" :loading="state.loadingSchool"
                                    @click="handleLogin">登录</a-button>
                                <a-button type="link" style="margin-left: -15px;margin-top: 5px;"
                                    @click="handleBack">返回</a-button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="version">v:{{ version }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useRouter } from 'vue-router'
import BarTop from '../../../components/BarTop/index.vue'
import http from "../../../utils/http"
import { useUserInfoStore } from "../../../store/useStore"

import { version } from '../../../../../package.json'

const userInfo = useUserInfoStore()
const router = useRouter()

const formState = reactive({
    // username: '14788880091',
    // password: '123456t.',
    username: '',
    password: '',
    grant_type: 'password',
    client_id: 'yide-eac-windows',
    client_secret: 'yide1234567',
})

const state = reactive({
    step: 1,
    loading: false,
    loadingSchool: false,
    user: {},
    schoolList: [],
    current: 0,
    loginType: 'pwd', // pwd | qrcode
    qrcode: '',
    qrcodeStatus: 'loading',
    random: ''
})

let instanceSwiper = null

function handleLogin() {
    const school = state.schoolList[state.current]
    state.loadingSchool = true
    if (school) {
        http.get(`/cloud/menu/checkUserLogin?schoolId=${school.id}`).then(() => {
            userInfo.setupUserInfo(state.user)
            router.push('/windowMain/home')
            state.step = 1
        }).finally(() => {
            state.loadingSchool = false
        })
    }
}

const onSwiper = (swiper) => {
    instanceSwiper = swiper;
};
const onSlideChange = (e) => {
    state.current = e.activeIndex
    console.log('slide change', e.activeIndex);
};
function changeSchool(type) {
    if (type === 'next') {
        instanceSwiper.slideNext();
    } else {
        instanceSwiper.slidePrev();
    }
}

function handleBack() {
    state.step = 1
}

let time = null

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function watchAuthQrCode() {
    if (state.loginType == 'pwd') return;
    await sleep(1000);
    http.get(`/auth/qrcode/check?random=${state.random}`).then(async res => {
        const { expiresIn, status, ticket } = res.data
        // ['未扫码', '已扫码', '已过期', '已授权', '取消授权'],
        if (status == 0) {
            await sleep(1000);
            watchAuthQrCode()
        }
        if (expiresIn <= 0 || status == 2) {
            state.qrcodeStatus = 'expired'
        }
        if (status == 1) {
            state.qrcodeStatus = 'scanned'
            await sleep(1000);
            watchAuthQrCode()
        }
        if (status == 3) {
            submitLogin(JSON.parse(ticket))
        }
        if (status == 4) {
            state.qrcodeStatus = 'expired'
        }
    }).catch(async () => {
        await sleep(1000);
        watchAuthQrCode()
    })
}

function generateQrCode() {
    state.qrcodeStatus = 'loading'
    http.get(`/auth/qrcode/gene`).then(async res => {
        const { expiresIn, qrCodeScannedUrl, random } = res.data
        state.qrcode = qrCodeScannedUrl
        state.qrcodeStatus = 'active'
        state.random = random
        watchAuthQrCode()
    }).catch(() => {

    }).finally(() => {

    })
}

function changeLoginType() {
    if (state.loginType === 'pwd') {
        state.loginType = 'qrcode'
        generateQrCode()
    } else {
        state.loginType = 'pwd'
    }
}

function submitLogin(params) {
    state.loading = true
    http.postForm('/auth/oauth/token', params).then(async (res) => {
        const { accessToken, refreshToken } = res.data

        localStorage.setItem('token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        try {
            const userData = await http.get('/cloud/user/getCurrentUser')
            const user = userData.data
            state.loading = false
            state.step = 2
            state.schoolList = user.school;
            state.user = user
            // if(user.school.length > 1){
            //     state.schoolList = user.school;
            //     return;
            // }else{
            //     // 
            // }
        } catch (error) {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
        }
    }).catch((error) => {
        console.error('Login failed:', error);
    }).finally(() => {
        state.loading = false
    })
}

const onFinish = (values) => {
    submitLogin(formState)
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

onMounted(() => {

})



</script>

<style scoped lang="less">
.container_wapper {
    display: flex;
    flex-direction: column;

    .content_warper {
        flex: 1;
        box-sizing: border-box;
        padding: 0 20px 20px 20px;

        .content {
            background: #EEF7F6;
            border-radius: 8px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: AlibabaPuHuiTiM;
            position: relative;

            .version {
                position: absolute;
                left: 50%;
                bottom: 10px;
                display: inline-block;
                transform: translateX(-50%);
                font-size: 12px;
                color: #666666;
            }

            .title {
                font-size: 38px;
                color: #000000;
                font-weight: bold;
            }

            .subtitle {
                font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                font-weight: 400;
                font-size: 22px;
                color: #666666;
                padding-top: 8px;
            }
        }

        .login_warper {
            background: #fff;
            border-radius: 0px 8px 8px 0px;
            display: flex;
            margin-top: 27px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .login_img_warper {
            height: 281px;
            width: 267px;           

            .login_img {
                height: 100%;
                width: 100%;
                display: block;               
            }
        }

        .login_form_warper {
            height: 281px;
            width: 251px;
            position: relative;

            .change-type {
                position: absolute;
                right: 0;
                top: 0;
                width: 42px;
                height: 42px;
                cursor: pointer;

                .change-type-img {
                    height: 100%;
                    width: 100%;
                    display: block;
                }
            }

            .login-pwd {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;

                .login-pwd-title {
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    font-size: 20px;
                    color: #333333;
                    text-align: center;
                }
            }

            .login-qrcode {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;

                .login-pwd-title {
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    font-size: 20px;
                    color: #333333;
                    text-align: center;
                }


                .scan-corner {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-color: #00B371;
                    border-style: solid;
                    border-width: 0;
                }

                .scan-corner.top-left {
                    top: 0;
                    left: 0;
                    border-top-width: 1px;
                    border-left-width: 1px;
                }

                .scan-corner.top-right {
                    top: 0;
                    right: 0;
                    border-top-width: 1px;
                    border-right-width: 1px;
                }

                .scan-corner.bottom-left {
                    bottom: 0;
                    left: 0;
                    border-bottom-width: 1px;
                    border-left-width: 1px;
                }

                .scan-corner.bottom-right {
                    bottom: 0;
                    right: 0;
                    border-bottom-width: 1px;
                    border-right-width: 1px;
                }


            }
        }
    }

    .select-warp {
        position: relative;
        margin-bottom: 20px;
        padding: 0 10px;

        .prev {
            position: absolute;
            left: -16px;
            top: 40%;
            transform: translateY(-50%);
            cursor: pointer;

            img {
                width: 24px;
                height: 24px;
                display: block;
            }
        }

        .next {
            position: absolute;
            right: -16px;
            top: 40%;
            transform: translateY(-50%);
            cursor: pointer;

            img {
                width: 24px;
                height: 24px;
                display: block;
            }
        }
    }

    .swiper-container {
        width: 100%;
        height: 100%;
    }

    .swiper-slide {
        text-align: center;
        font-size: 14px;
        // background: #eee;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        transition: 300ms;
        transform: scale(0.8);
        cursor: pointer;

        .school-name {
            max-width: 72px;
        }
    }

    .swiper-slide-active,
    .swiper-slide-duplicate-active {
        transform: scale(1);
    }
}
</style>
