/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: lai_hq@qq.com
 * @Date: 2022-12-14 16:54:31
 * @LastEditors: lai_hq@qq.com
 * @LastEditTime: 2022-12-19 11:15:13
 */
import knex, { Knex } from "knex";
import fs from "fs";
import path from "path";
let dbInstance: Knex;

if (!dbInstance) {
  let dbPath;
  
  if (location.href.startsWith("http")) {
    dbPath = path.join(process.cwd(), "/src/common/db.db");
    
  } else {
    // process.platform等于darwin表示操作系统是（macOS）
    // dbPath = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");
    console.log("platform",process.platform)
    try {
      dbPath = path.join(process.cwd(), "/resources/db.db");
      let dbIsExist = fs.existsSync(dbPath);
      console.log("copy", dbIsExist, dbPath);
      
      if (!dbIsExist) {
        let resourceDbPath = path.join(process.execPath, "../resources/db.db");
        fs.copyFileSync(resourceDbPath, dbPath);
        console.log("copy");
      }
    } catch (error) {
      
    }
  }
  dbInstance = knex({
    client: "better-sqlite3",
    connection: { filename: dbPath },
    useNullAsDefault: true,
  });
}
export const db = dbInstance;
