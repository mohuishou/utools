import { readFileSync, writeFileSync } from "fs";
import { Database } from "sql.js";
const initSqlJs = require("../third_party/sqljs/sql-wasm");

export interface Recent {
  entries: Entry[];
}

export interface Entry {
  folderUri?: string;
  workspace?: Workspace;
  label?: string;
  remoteAuthority?: string;
  fileUri?: string;
}

export interface Workspace {
  id: string;
  configPath: string;
}

export async function GetFiles(path: string) {
  let db = new (await initSqlJs()).Database(readFileSync(path)) as Database;
  let sql =
    "select value from ItemTable where key = 'history.recentlyOpenedPathsList'";
  let results = db.exec(sql);
  let res = results[0].values.toString();
  if (!res)
    throw new Error(
      "数据获取失败, 请检查 vsc-setting 配置, <br/> 注意当前仅在 vscode 1.64 版本进行过测试"
    );
  let data = JSON.parse(res) as Recent;

  return data.entries.map((file) => {
    if (typeof file === "string") return file;
    let path = file.fileUri || file.folderUri || file.workspace.configPath;
    return path;
  });
}

/**
 * 删除 VSCode 历史记录中的指定记录
 * @param dbPath 数据库文件路径
 * @param targetPath 要删除的文件/文件夹路径
 * @returns 是否删除成功
 */
export async function DeleteFiles(dbPath: string, targetPath: string): Promise<boolean> {
  try {
    // 读取数据库
    let db = new (await initSqlJs()).Database(readFileSync(dbPath)) as Database;
    
    // 获取当前的历史记录
    let sql = "select value from ItemTable where key = 'history.recentlyOpenedPathsList'";
    let results = db.exec(sql);
    
    if (!results || results.length === 0 || !results[0].values[0]) {
      throw new Error("未找到历史记录数据");
    }
    
    let res = results[0].values[0].toString();
    let data = JSON.parse(res) as Recent;
    
    // 过滤掉要删除的记录
    let originalLength = data.entries.length;
    data.entries = data.entries.filter((entry) => {
      if (typeof entry === "string") {
        return entry !== targetPath;
      }
      
      let entryPath = entry.fileUri || entry.folderUri || entry.workspace?.configPath;
      return entryPath !== targetPath;
    });
    
    // 检查是否有记录被删除
    if (data.entries.length === originalLength) {
      return false; // 没有找到匹配的记录
    }
    
    // 更新数据库
    let updatedJson = JSON.stringify(data);
    db.run(
      "UPDATE ItemTable SET value = ? WHERE key = 'history.recentlyOpenedPathsList'",
      [updatedJson]
    );
    
    // 保存数据库文件
    let buffer = db.export();
    writeFileSync(dbPath, buffer);
    
    // 关闭数据库连接
    db.close();
    
    return true;
  } catch (error) {
    console.error("删除历史记录失败:", error);
    throw new Error(`删除历史记录失败: ${error.message}`);
  }
}

/**
 * 批量删除 VSCode 历史记录中的指定记录
 * @param dbPath 数据库文件路径
 * @param targetPaths 要删除的文件/文件夹路径数组
 * @returns 删除成功的记录数量
 */
export async function DeleteMultipleFiles(dbPath: string, targetPaths: string[]): Promise<number> {
  try {
    // 读取数据库
    let db = new (await initSqlJs()).Database(readFileSync(dbPath)) as Database;
    
    // 获取当前的历史记录
    let sql = "select value from ItemTable where key = 'history.recentlyOpenedPathsList'";
    let results = db.exec(sql);
    
    if (!results || results.length === 0 || !results[0].values[0]) {
      throw new Error("未找到历史记录数据");
    }
    
    let res = results[0].values[0].toString();
    let data = JSON.parse(res) as Recent;
    
    // 过滤掉要删除的记录
    let originalLength = data.entries.length;
    data.entries = data.entries.filter((entry) => {
      if (typeof entry === "string") {
        return !targetPaths.includes(entry);
      }
      
      let entryPath = entry.fileUri || entry.folderUri || entry.workspace?.configPath;
      return !targetPaths.includes(entryPath);
    });
    
    let deletedCount = originalLength - data.entries.length;
    
    if (deletedCount > 0) {
      // 更新数据库
      let updatedJson = JSON.stringify(data);
      db.run(
        "UPDATE ItemTable SET value = ? WHERE key = 'history.recentlyOpenedPathsList'",
        [updatedJson]
      );
      
      // 保存数据库文件
      let buffer = db.export();
      writeFileSync(dbPath, buffer);
    }
    
    // 关闭数据库连接
    db.close();
    
    return deletedCount;
  } catch (error) {
    console.error("批量删除历史记录失败:", error);
    throw new Error(`批量删除历史记录失败: ${error.message}`);
  }
}
