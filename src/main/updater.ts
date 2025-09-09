
import { dialog } from "electron";
import { autoUpdater } from "electron-updater";

// 全量升级
export class Updater {
  static check() {
    
    autoUpdater.checkForUpdates();
    // 当 autoUpdater.checkForUpdates() 方法执行时，
    // 应用会先请求 release目录下 这个 yml 文件，得到文件里的内容后，再拿此文件中的版本号与当前版本号对比，
    // 如果此文件中的版本号比当前版本号新，则下载新版本，否则就退出更新逻辑。

    console.log(`check`)
    autoUpdater.on("update-downloaded", async () => {

      console.log(`update-downloaded`)
      await dialog.showMessageBox({
        message: "有可用的升级",
      });
      autoUpdater.quitAndInstall();

      //当新版本安装包下载完成后，electron-updater 会验证文件的 sha512 值是否合法，yml 文件中包含新版本安装包的 sha512 值，electron-updater 首先计算出下载的新版本安装包的 sha512 值，然后再与 yml 文件中的 sha512 值对比，两个值相等，则验证通过，不相等则验证不通过。
      //验证通过后 Electron 则使用 Node.js 的 child-process 模块启动这个新的安装文件，以完成应用程序升级工作。      
    });
  }
}