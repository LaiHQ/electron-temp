/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-12 16:14:48
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-23 17:53:19
 */
import {
  app,
  BrowserWindow,
  crashReporter,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
  dialog,
  ipcMain
} from "electron";

import path from "path";

import { CustomScheme } from "./customScheme";

import { CommonWindowEvent } from "./commonWindowEvent";

import { Updater } from "./updater";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

//崩溃报告 当应用程序崩溃时，就会产生一个.dmp 扩展名结尾的文件（存放于 C:\Users\[yourOsUserName]\AppData\Roaming\[yourAppName]\Crashpad
crashReporter.start({ submitURL: "", uploadToServer: false });

// 每当有一个窗口被创建成功后，这个事件就会被触发
app.on("browser-window-created", (e, win) => {
  CommonWindowEvent.regWinEvent(win);
});

let mainWindow: BrowserWindow;
let loading: BrowserWindow;
let timer: any;

function createWindow() {
  const config = {
    width: 1200,
    height: 800,
    frame: false,
    show: false,
    minWidth: 900, // 设置最小宽度为 400 像素
    minHeight: 800,
    icon: path.join(process.cwd(), "/resources/icons/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);

  createTray();

  createGlobalShortcut();

  // 导航完成时触发，即选项卡的旋转器将停止旋转，并指派onload事件后。
  mainWindow.webContents.on("did-finish-load", () => {    // // 发送数据给渲染程序
    // mainWindow.webContents.send('something', '主进程发送到渲染进程的数据')
  });

  const UpdaterCheck = () => {
    Updater.check((res: any) => {
      timer && clearInterval(timer);
      // mainWindow.webContents.send('updateApp', res)
      if (res.type == "updateAvailable") {
        mainWindow.webContents.send("updateAppAuto", { type: "1", data: res });
      } else if (res.type == "updateDownloadedEnd") {
        mainWindow.webContents.send("updateAppAuto", { type: "0", data: res });
      } else if (res.type == "updateProgress") {
        mainWindow.webContents.send("updateAppAuto", { type: "2", data: res });
      }
    });
  };

  ipcMain.on("UpdaterCheck", (_, data) => {
    if (data == "development") {
      mainWindow.webContents.send("console", "生产环境,检测更新");
      UpdaterCheck();
      timer = setInterval(() => {
        UpdaterCheck();
      }, 1000 * 60 * 5);
    }
  });

  if (process.argv[2]) {
    // 开发模式
    // mainWindow.webContents.openDevTools({ mode: "right" });
    // mainWindow.setSimpleFullScreen(true)
    // console.log("process.argv[2]",process.argv)
    // mainWindow.loadURL(process.argv[2]);
    mainWindow.loadURL(`http://localhost:5173/`);
    // mainWindow.loadURL(`https://www.fsse.vip/`);
  } else {
    // 生产模式
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }

  CommonWindowEvent.listen();

  mainWindow.once("show", () => {
    loading?.hide();
    loading?.close();
    mainWindow.show();
  });
}

// 系统托盘
function createTray() {
  // 创建icon我这里使用的是一个png
  const icon = nativeImage.createFromPath(
    path.join(process.cwd(), "/src/renderer/assets/logo32.png")
  );
  // 实例化一个 托盘对象，传入的是托盘的图标
  const tray = new Tray(icon);
  // 移动到托盘上的提示
  tray.setToolTip("课堂评价系统");
  // 还可以设置 titlle
  // tray.setTitle('课堂评价系统')

  // 监听托盘右键事件
  tray.on("right-click", () => {
    // 右键菜单模板
    const tempate = [
      {
        label: "打开课堂评价",
      },
      {
        label: "退出",
        click: () => app.quit(),
      },
    ];
    //通过 Menu 创建菜单
    const menuConfig = Menu.buildFromTemplate(tempate);
    // 让我们的写的托盘右键的菜单替代原来的
    tray.popUpContextMenu(menuConfig);
  });
  //监听点击托盘的事件
  tray.on("click", () => {
    // 这里来控制窗口的显示和隐藏
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

// 全局快捷键
function createGlobalShortcut() {
  // globalShortcut.register("CmdOrCtrl+P", () => {
  //   dialog.showMessageBox({
  //     type: "info",
  //     message: "你按下了全局注册的快捷键",
  //   });
  // });
  globalShortcut.register("CmdOrCtrl+O", function () {
    mainWindow.webContents.openDevTools({ mode: "right" });
  });
}

function showLoading(cb: Function) {
  loading = new BrowserWindow({
    show: false,
    frame: false,
    width: 950,
    height: 600,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
  });

  if (process.argv[2]) {
    loading.loadFile(path.join(process.cwd(), "loading.html"));
  } else {
    // CustomScheme.registerScheme('loading.html');
    loading.loadFile(`./loading.html`);
  }

  loading.once("show", () => {
    setTimeout(cb, 500);
  });

  loading.show();
}

app.on("ready", () => {
  // showLoading(createWindow)
  console.log('__ready__')
  createWindow();
});
