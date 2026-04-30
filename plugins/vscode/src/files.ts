import { existsSync, readFileSync, writeFileSync } from "fs";
import { Database } from "sql.js";
import { join } from "path";
import { env } from "process";

// 指定路径 (相对于 dist 目录)
const sqlWasmDir = join(__dirname, "third_party/sqljs");

// 直接读取 sql-wasm.js 文件并执行
const sqlWasmJsPath = join(sqlWasmDir, "sql-wasm.js");
const sqlWasmCode = readFileSync(sqlWasmJsPath, "utf8");
// eslint-disable-next-line no-new-func
const initSqlJs = new Function("require", "module", "exports", sqlWasmCode + "\nreturn module.exports;")(require, { exports: {} }, {}).default || require;
const RECENTLY_OPENED_STORAGE_KEY = "history.recentlyOpenedPathsList";

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

function getVSCodeSharedStoragePath(): string {
  const home = env.USERPROFILE || env.HOME;
  return home ? join(home, ".vscode-shared", "sharedStorage", "state.vscdb") : "";
}

function shouldFallbackToVSCodeSharedStorage(dbPath: string): boolean {
  const normalized = dbPath.replace(/\\/g, "/").toLowerCase();
  return normalized.endsWith("/code/user/globalstorage/state.vscdb");
}

function getStorageCandidates(dbPath: string): string[] {
  const candidates = [dbPath];
  const sharedStoragePath = getVSCodeSharedStoragePath();

  if (
    sharedStoragePath &&
    existsSync(sharedStoragePath) &&
    shouldFallbackToVSCodeSharedStorage(dbPath) &&
    !candidates.includes(sharedStoragePath)
  ) {
    candidates.push(sharedStoragePath);
  }

  return candidates;
}

function readUInt32BE(buffer: Buffer, offset: number): number {
  return buffer.readUInt32BE(offset);
}

function getSQLitePageSize(dbBuffer: Buffer): number {
  if (dbBuffer.length < 100) {
    return 4096;
  }

  const pageSize = dbBuffer.readUInt16BE(16);
  return pageSize === 1 ? 65536 : pageSize;
}

function readDatabaseWithWal(dbPath: string): Buffer {
  const dbBuffer = readFileSync(dbPath);
  const walPath = `${dbPath}-wal`;

  if (!existsSync(walPath)) {
    return dbBuffer;
  }

  const walBuffer = readFileSync(walPath);
  if (walBuffer.length < 32) {
    return dbBuffer;
  }

  const magic = readUInt32BE(walBuffer, 0);
  if (magic !== 0x377f0682 && magic !== 0x377f0683) {
    throw new Error(`无法识别 SQLite WAL 文件: ${walPath}`);
  }

  const walPageSize = readUInt32BE(walBuffer, 8);
  const pageSize = walPageSize || getSQLitePageSize(dbBuffer);
  if (pageSize <= 0) {
    throw new Error(`无法读取 SQLite WAL page size: ${walPath}`);
  }

  const salt1 = readUInt32BE(walBuffer, 16);
  const salt2 = readUInt32BE(walBuffer, 20);
  const frameSize = pageSize + 24;
  let merged = Buffer.from(dbBuffer);
  let committedPageCount = Math.ceil(merged.length / pageSize);
  let pendingFrames: Array<{ pageNumber: number; page: Buffer }> = [];

  for (let offset = 32; offset + frameSize <= walBuffer.length; offset += frameSize) {
    const pageNumber = readUInt32BE(walBuffer, offset);
    const frameCommitPageCount = readUInt32BE(walBuffer, offset + 4);
    const frameSalt1 = readUInt32BE(walBuffer, offset + 8);
    const frameSalt2 = readUInt32BE(walBuffer, offset + 12);

    if (!pageNumber || frameSalt1 !== salt1 || frameSalt2 !== salt2) {
      continue;
    }

    pendingFrames.push({
      pageNumber,
      page: Buffer.from(walBuffer.subarray(offset + 24, offset + 24 + pageSize)),
    });

    if (frameCommitPageCount) {
      for (const frame of pendingFrames) {
        const pageOffset = (frame.pageNumber - 1) * pageSize;
        const requiredLength = pageOffset + pageSize;
        if (merged.length < requiredLength) {
          const expanded = Buffer.alloc(requiredLength);
          merged.copy(expanded);
          merged = expanded;
        }

        frame.page.copy(merged, pageOffset);
      }
      committedPageCount = frameCommitPageCount;
      pendingFrames = [];
    }
  }

  return merged.subarray(0, committedPageCount * pageSize);
}

function getRecentValue(db: Database): string {
  const sql = `select value from ItemTable where key = '${RECENTLY_OPENED_STORAGE_KEY}'`;
  const results = db.exec(sql);
  const value = results?.[0]?.values?.[0]?.[0];

  if (!value) {
    throw new Error("未找到 VSCode 历史记录数据");
  }

  return value.toString();
}

async function openRecentDatabase(dbPath: string): Promise<{ db: Database; value: string; path: string }> {
  let SQL = await initSqlJs({ locateFile: (file: string) => join(sqlWasmDir, file) });
  let lastError: Error | undefined;

  for (const path of getStorageCandidates(dbPath)) {
    let db: Database | undefined;
    try {
      db = new SQL.Database(readDatabaseWithWal(path)) as Database;
      return { db, value: getRecentValue(db), path };
    } catch (error) {
      if (db) {
        db.close();
      }
      lastError = error as Error;
    }
  }

  throw new Error(
    `${lastError?.message || "数据获取失败"}。请检查 database 配置；VS Code 1.118+ 需要使用 .vscode-shared/sharedStorage/state.vscdb`
  );
}

export async function GetFiles(path: string) {
  const { db, value } = await openRecentDatabase(path);
  let data: Recent;

  try {
    data = JSON.parse(value) as Recent;
  } finally {
    db.close();
  }

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
  let db: Database | undefined;

  try {
    const opened = await openRecentDatabase(dbPath);
    db = opened.db;
    const { value, path } = opened;

    if (existsSync(`${path}-wal`)) {
      throw new Error("检测到 VSCode 数据库存在 WAL 文件，请先关闭 VSCode 或执行 wal_checkpoint 后再删除历史记录");
    }
    
    // 获取当前的历史记录
    let data = JSON.parse(value) as Recent;
    
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
      `UPDATE ItemTable SET value = ? WHERE key = '${RECENTLY_OPENED_STORAGE_KEY}'`,
      [updatedJson]
    );
    
    // 保存数据库文件
    let buffer = db.export();
    writeFileSync(path, buffer);

    return true;
  } catch (error) {
    console.error("删除历史记录失败:", error);
    throw new Error(`删除历史记录失败: ${error.message}`);
  } finally {
    if (db) {
      db.close();
    }
  }
}

/**
 * 批量删除 VSCode 历史记录中的指定记录
 * @param dbPath 数据库文件路径
 * @param targetPaths 要删除的文件/文件夹路径数组
 * @returns 删除成功的记录数量
 */
export async function DeleteMultipleFiles(dbPath: string, targetPaths: string[]): Promise<number> {
  let db: Database | undefined;

  try {
    const opened = await openRecentDatabase(dbPath);
    db = opened.db;
    const { value, path } = opened;

    if (existsSync(`${path}-wal`)) {
      throw new Error("检测到 VSCode 数据库存在 WAL 文件，请先关闭 VSCode 或执行 wal_checkpoint 后再删除历史记录");
    }
    
    // 获取当前的历史记录
    let data = JSON.parse(value) as Recent;
    
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
        `UPDATE ItemTable SET value = ? WHERE key = '${RECENTLY_OPENED_STORAGE_KEY}'`,
        [updatedJson]
      );
      
      // 保存数据库文件
      let buffer = db.export();
      writeFileSync(path, buffer);
    }

    return deletedCount;
  } catch (error) {
    console.error("批量删除历史记录失败:", error);
    throw new Error(`批量删除历史记录失败: ${error.message}`);
  } finally {
    if (db) {
      db.close();
    }
  }
}
