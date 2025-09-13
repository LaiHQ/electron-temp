/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-15 11:19:31
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2023-02-15 09:59:29
 */
import { ipcMain, app } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'

import { version } from '../../package.json'

// 安装
ipcMain.handle('update-version', (e) => {
  autoUpdater.quitAndInstall()
})

// 下载
ipcMain.handle('update-downloaded', (e) => {
  autoUpdater.downloadUpdate()
})

// 全量升级
export class Updater {
  static check(cb: Function) {
    //设置是否自动下载
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true
    if (process.env.NODE_ENV === 'development') {
      Object.defineProperty(app, 'isPackaged', {
        get() {
          return true
        },
      })
      autoUpdater.updateConfigPath = path.join(
        __dirname,
        '../dev-app-update.yml'
      )
      // console.log(autoUpdater)
    }

    // 检查更新
    console.log(`开始检查更新`)
    autoUpdater.checkForUpdates().catch((err) => {
      console.log('网络连接问题', err)
    })
    // 当 autoUpdater.checkForUpdates() 方法执行时，
    // 应用会先请求 release目录下 这个 yml 文件，得到文件里的内容后，再拿此文件中的版本号与当前版本号对比，
    // 如果此文件中的版本号比当前版本号新，则下载新版本，否则就退出更新逻辑。
    // 下载完成
    autoUpdater.on('update-downloaded', async (data) => {
      setTimeout(() => {
        autoUpdater.quitAndInstall(true, true)
      }, 3000)
      // 有可用的升级
      cb({
        type: 'updateDownloadedEnd',
        data,
      })
      //当新版本安装包下载完成后，electron-updater 会验证文件的 sha512 值是否合法，yml 文件中包含新版本安装包的 sha512 值，electron-updater 首先计算出下载的新版本安装包的 sha512 值，然后再与 yml 文件中的 sha512 值对比，两个值相等，则验证通过，不相等则验证不通过。
      //验证通过后 Electron 则使用 Node.js 的 child-process 模块启动这个新的安装文件，以完成应用程序升级工作。
    })

    autoUpdater.on('download-progress', (data) => {
      console.log('下载监听', data)
      cb({
        type: 'updateProgress',
        data,
      })
    })

    autoUpdater.on('update-not-available', (res) => {
      console.log(`没有可更新版本`, res)
    })

    autoUpdater.on('update-available', (data) => {
      console.log('发现新版本', data)
      cb({
        type: 'updateAvailable',
        data,
      })
    })

    autoUpdater.on('error', function (error) {
      console.log('出错')
    })
  }
}
