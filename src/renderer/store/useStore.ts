import { defineStore } from "pinia";
import http from "../utils/http";

//定义一个Store
export const useUserInfoStore = defineStore("user", {
    state: () => {
        return {
            isMaximized:false,
            user: {},
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
        }

    },
    actions: {
        changeMaximized(status:boolean){
            this.isMaximized = status
        },
        clearUserInfo(){
            this.user = {}
            this.classMaterList = []
            this.currentClassId = ''
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
        }
    },

});