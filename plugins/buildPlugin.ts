import path from "path";
import fs from "fs-extra";

class BuildObj {
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: "./dist/mainEntry.js",
      external: ["electron"],
    });
  }
  preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
 
   
    if( localPkgJson.dependencies==undefined){
      localPkgJson.dependencies = {}
    }
    localPkgJson.dependencies["better-sqlite3"] = "*";
    localPkgJson.dependencies["bindings"] = "*";
    localPkgJson.dependencies["knex"] = "*";
    
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
    
  }
  async prepareSqlite() {
    let srcDir = path.join(process.cwd(), `node_modules/better-sqlite3`);
    let destDir = path.join(process.cwd(), `dist/node_modules/better-sqlite3`);
    // 确保目录存在，如果不存在就创建
    fs.ensureDirSync(destDir);  

    try { 
      // 复制文件或目录。目录可以包含内容。      
      fs.copySync(srcDir,destDir, {     
        dereference:true,
        filter: (src, dest) => {  
          if (src.endsWith("better-sqlite3") || src.endsWith("build") || src.endsWith("Release") || src.endsWith("better_sqlite3.node")) return true;
          else if (src.includes("node_modules\\better-sqlite3\\lib")) return true;
          else return false;
        },
      });      
    } catch (error) {
        console.error("_______e_______",error)       
    }
   

    let pkgJson = `{"name": "better-sqlite3","main": "lib/index.js"}`;
    let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/better-sqlite3/package.json`);

 
    fs.writeFileSync(pkgJsonPath, pkgJson);

    let bindingPath = path.join(process.cwd(), `dist/node_modules/bindings/index.js`);
    fs.ensureFileSync(bindingPath);
    let bindingsContent = `module.exports = () => {
  let addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
  return require(addonPath);
  };`;
    fs.writeFileSync(bindingPath, bindingsContent);

    pkgJson = `{"name": "bindings","main": "index.js"}`;
    pkgJsonPath = path.join(process.cwd(), `dist/node_modules/bindings/package.json`);
    fs.writeFileSync(pkgJsonPath, pkgJson);
  }
  prepareKnexjs() {
    let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/knex`);
    fs.ensureDirSync(pkgJsonPath);
    require("esbuild").buildSync({
      entryPoints: ["./node_modules/knex/knex.js"],
      bundle: true,
      platform: "node",
      format: "cjs",
      minify: true,
      outfile: "./dist/node_modules/knex/index.js",
      external: ["oracledb", "pg-query-stream", "pg", "sqlite3", "tedious", "mysql", "mysql2", "better-sqlite3"],
    });
    let pkgJson = `{"name": "bindings","main": "index.js"}`;
    pkgJsonPath = path.join(process.cwd(), `dist/node_modules/knex/package.json`);
    fs.writeFileSync(pkgJsonPath, pkgJson);
  }
  buildInstaller() {

    let srcDir = path.join(process.cwd(), `loading.html`);
    let destDir = path.join(process.cwd(), `dist/loading.html`);

    fs.copySync(srcDir,destDir)


    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: ["**"],
        extends: null,
        productName: "fsse", //项目名，也是生成的安装文件名，即aDemo.exe
        appId: "com.fsse.desktop",
        copyright: "Copyright © 2022", //版权信息
        asar: true,
        win: {
          //win相关配置
          // icon: "./build/icons/icon.ico", //图标，当前图标在根目录下，注意这里有两个坑
          target: [
            {
              target: "nsis", //利用nsis制作安装程序,打包文件的后缀为exe
              arch: [
                "x64", //64位
                "ia32" //32位
              ]
            }
          ]
        },
        nsis: {
          oneClick: false,  //一键安装
          language: "2052", //安装语言
          perMachine: false,  //应用所有用户
          allowToChangeInstallationDirectory: true, //用户可以选择路径
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "fsseDesktop",
        },
        publish: [
          // 这个路径指向你的新版本安装包所在的服务器目录
          // 要把 release 目录下的[your_project_name] Setup [your_project_version].exe 和 latest.yml 两个文件上传到第 1 点中指定的服务器地址下（这是 Windows 平台下的工作）。
          // Mac 平台下要把 release 目录下的[your_project_name]-[your_project_version]-mac.zip、[your_project_name]-[your_project_version].dmg 和 latest-mac.yml 三个文件上传到指定的服务器地址下。
          { provider: "generic", url: "http://localhost:8000/" }
        ],

        // extraResources可以让开发者为安装包指定额外的资源文件，electron-builder 
        // 打包应用时会把这些资源文件附加到安装包内，当用户安装应用程序时，这些资源会释放在安装目录的 resources\子目录下。
        // https://www.electron.build/configuration/contents.html#filesetto
        extraResources: [
          // { from: `./src/common/db.db`, to: `./` }
        ],
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}

export let buildPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.prepareSqlite();
      buildObj.prepareKnexjs();
      buildObj.buildInstaller();
    },
  };
};
