import { defineStore } from "pinia";
import http from "../utils/http";

//定义一个Store
export const useUserInfoStore = defineStore("user", {
    state: () => {
        return {
            isMaximized:false,
            user: {},
            evalMedalType:[],
            currentMedalTypeId:'',

            classMaterList: [],
            currentClassId:''
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getClassMaterList(state) {
            return state.classMaterList
        },
        getCurrentClass(state){
            return state.classMaterList.find(i=> i.id === state.currentClassId)
        },
        getIsMaximized(state){
            return state.isMaximized
        },
        getEvalMedalType(state){
             return state.evalMedalType
        },
        getCurrentMedalType(state){
            return state.evalMedalType.find(i=> i.id === state.currentMedalTypeId)
        }


    },
    actions: {
        changeMedalType(id){
            this.currentMedalTypeId = id
        },
        changeMaximized(status:boolean){
            this.isMaximized = status
        },
        clearUserInfo(){
            this.user = {}
            this.classMaterList = []
            this.evalMedalType = []
            this.currentClassId = ''
            this.currentMedalTypeId = ''
        },
        setupUserInfo(user = {}) {
            this.user = user
        },
        changeCLass(id:string){
            this.currentClassId = id
        },
        queryClassMaterList(cb){
            const _this = this
            return new Promise((resolve,reject)=>{
                http.get('/cloud/v3/classes/queryClassMaterList').then((res:any)=>{        
                    _this.classMaterList = res.data || [];
                    if(!_this.currentClassId){
                        _this.currentClassId =  res.data[0]?.id ?? ''
                    }
                    resolve(res.data || []);
                }).catch((err)=>{
                    reject(err)
                    cb && cb(err)
                    console.log('获取班级列表失败',err)
                })
            })
        },
        queryPageEvalMedalType(cb:Function){
            const _this = this
            return new Promise((resolve,reject)=>{
                http.post(`/cloud/evalMedalType/listEvalMedalType`,{name:''}).then(res=>{
                    _this.evalMedalType = res.data
                    if(!_this.currentMedalTypeId){
                        _this.currentMedalTypeId =  res.data[0]?.id ?? ''
                    }
                    cb && cb(_this.currentMedalTypeId)
                    resolve(res.data || [])
                }).catch((err)=>{
                    reject(err)
                    console.log('获取分类失败',err)
                })
            })
        }
    },
    persist: {
        key: "userInfo",
        paths: ["user", "classMaterList","currentClassId","evalMedalType","currentMedalTypeId"],
        debug: import.meta.env.VITE_USER_NODE_ENV === "production",
        beforeRestore: (ctx) => {
            console.log(`beforeRestore '${ctx.store.$id}'`)
        },

        afterRestore: (ctx) => {
            console.log(`afterRestore '${ctx.store.$id}'`)
        }
    }
});