/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-13 18:22:10
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-14 10:03:50
 */
import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { ModelChat } from "../../model/modelChat";
import { useMessageStore } from "./useMessageStore";
//初始化模拟数据
let prepareData = () => {
  let result = [];
  for (let i = 0; i < 10; i++) {
    let model = new ModelChat();
    model.fromName = "聊天对象" + i;
    model.sendTime = "昨天";
    model.lastMsg = "这是此会话的最后一条消息" + i;
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(model);
  }
  return result;
};


//定义一个Store
export const useChatStore = defineStore("chat", () => {

  let data: Ref<ModelChat[]> = ref(prepareData());
  let selectItem = (item: ModelChat) => {
    if (item.isSelected) return;
   
      data.value.forEach((v) => (v.isSelected = false));
      item.isSelected = true;

    let messageStore = useMessageStore(); //新增的行
    messageStore.initData(item); //新增的行
  };
  return { data, selectItem };

});