<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-12 15:58:44
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-19 17:42:43
-->

## 注意点

1. 在`package.json`中

   把 vue 从 dependencies 配置节移至了 devDependencies 配置中。
   这是因为在 Vite 编译项目的时候，Vue 库会被编译到输出目录下，输出目录下的内容是完整的，没必要把 Vue 标记为生产依赖；而且在我们将来制作安装包的时候，还要用到这个 package.json 文件，它的生产依赖里不应该有没用的东西

## 目录结构

dist 目录是我们打包过程的临时产物放置目录。
plugins 目录放置我们的开发环境 Vite 插件和打包 Vite 插件。
release 目录放置最终生成的安装包。
resource 目录放置一些外部资源，比如应用程序图标、第三方类库等。
src/common 目录放置主进程和渲染进程都会用到的公共代码，比如日期格式化的工具类、数据库访问工具类等，主进程和渲染进程的代码都有可能使用这些类。
src/main 目录放置主进程的代码。
src/model 目录放置应用程序的模型文件，比如消息类、会话类、用户设置类等，主进程和渲染进程的代码都有可能使用这些类。
src/renderer 目录放置渲染进程的代码。
src/renderer/assets 放置字体图标、公共样式、图片等文件。
src/renderer/Component 放置公共组件，比如标题栏组件、菜单组件等。
src/renderer/store 目录存放 Vue 项目的数据状态组件，用于在不同的 Vue 组件中共享数据。
src/renderer/Window 目录存放不同窗口的入口组件，这些组件是通过 vue-router 导航的，这个目录下的子目录存放对应窗口的子组件。
src/renderer/App.vue 是渲染进程的入口组件，这个组件内只有一个用于导航到不同的窗口。
src/renderer/main.ts 是渲染进程的入口脚本。
index.html 是渲染进程的入口页面。
vite.config.ts 是 Vite 的配置文件。
   
## 生产环境如何调试？   

## 如何分析崩溃报告？

1. [点击下载适用于 Windows 的调试工具](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools)

2. 安装完成后，通过菜单 File->Symbol File Path 打开符号路径设置窗口，输入如下信息：
`SRV*d:\code\symbols\*https://msdl.microsoft.com/download/symbols;SRV*d:\code\symbols\*https://symbols.electronjs.org`

这段配置中有三个关键信息，依次是符号文件的缓存路径、Windows 操作系统关键 dll 的符号服务器和 Electron 的符号服务器。

设置完符号服务器之后，通过菜单 File->Open Crash Dump 打开我们刚刚生成的崩溃报告，接着就等待 WinDbg 加载对应的符号（WinDbg 会通过 Electron 符号服务器下载与崩溃报告对应的 Electron 版本的符号文件，并保存在缓存目录中以备下次使用）。

接着再在命令窗口的底部输入!analyze -v 指令开始分析崩溃报告（注意此时需要全程具备良好的网络环境）。

加载完成后 WinDbg 会在窗口中显示崩溃报告内部的信息

使用 WinDbg 分析崩溃报告设置比较烦琐，为此社区内有人（Electron 贡献者之一）专门开发了一个崩溃报告分析工具：[electron-minidump](https://github.com/nornagon/electron-minidump) 。



## 终端乱码问题

终端输入`chcp 65001`


## 使用 remote 模块, 你可以调用 main 进程对象的方法

`const { remote } = require('electron')`


## 自定义任务栏的缩略图工具栏
`https://www.electronjs.org/docs/latest/tutorial/windows-taskbar#%E7%BC%A9%E7%95%A5%E5%9B%BE%E5%B7%A5%E5%85%B7%E6%A0%8F`


## 自定义托盘菜单
通过一个窗体来模拟。通过监听托盘的右键点击事件切换菜单的显示隐藏即可，其中需要实时计算出每次菜单出现的位置及边界情况。


## Node.js嵌入式数据库Nedb


### 自定义协议实现浏览器中启动客户端
`app.setAsDefaultProtocolClient`

## 离线/在线侦测与桌面通知

通过window的online和offline可监听网络状态。

通过navigator.onLine可判断当前网络状态.

通过h5的Notification可实现桌面通知，在window平台中使用请确保设置appId


## 自动构建
[持续集成](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)


## 自定义安装
[NSIS-UI](https://github.com/hilanmiao/NSIS-UI)


https://lanhuapp.com/web/#/item/project/detailDetach?pid=7828b66f-97dc-4172-be9d-45e5cca0239c&project_id=7828b66f-97dc-4172-be9d-45e5cca0239c&image_id=5940c6b1-3718-4329-bd7d-faef1c3e11e3&fromEditor=true