/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-13 15:08:12
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-13 15:36:25
 */
export const createDialog = (url: string, config: any): Promise<Window> => {
    return new Promise((resolve, reject) => {
      let windowProxy = window.open(url, "_blank", JSON.stringify(config));
      let readyHandler = (e) => {
        let msg = e.data;
        if (msg["msgName"] === `__dialogReady`) {
          window.removeEventListener("message", readyHandler);
          resolve(windowProxy as Window);
        }
      };
      window.addEventListener("message", readyHandler);
    });
  };
  

export const dialogReady = () => {
    let msg = { msgName: `__dialogReady` };
    window.opener.postMessage(msg);
};