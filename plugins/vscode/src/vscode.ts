import { Plugin, ListItem } from "utools-helper";
import { basename, join, extname } from "path";
import { existsSync, readdirSync } from "fs";
import { ExecOptions, exec, execSync } from "child_process";
import { fileURLToPath } from "url";
import { GetFiles, DeleteFiles, DeleteMultipleFiles } from "./files";
import { Config, GetConfig, NewConfig, SaveConfig } from "./setting";

interface CleanScanState {
  inputWord: string;
  searchWord: string;
  status: "scanning" | "ready" | "error";
  files: string[];
  error?: string;
}

export class VSCode implements Plugin {
  code = "vsc";
  _storage = "";
  delay = 100;
  config: Config;
  placeholder = "输出关键词查询, -rm 激活删除模式, -clean 清理无效记录";
  private isRemoveMode = false;
  private isCleanMode = false;
  private readonly cleanAllData = "__clean_all__";
  private readonly cleanScanningData = "__clean_scanning__";
  private readonly cleanEmptyData = "__clean_empty__";
  private readonly cleanErrorData = "__clean_error__";
  private cleanScanSequence = 0;
  private cleanScanState?: CleanScanState;
  private lastSearchWord = "";

  constructor(code: string) {
    this.code = code;
    this.config = this.loadConfig(this.code);
  }

  private loadConfig(code: string): Config {
    const config = NewConfig(code);
    if (code === "vsc" || code === "vscode") {
      config.command = "code";
    }

    const saved = GetConfig(code);
    Object.keys(saved).forEach((key) => {
      const value = saved[key];
      if (value !== undefined && value !== "") {
        config[key] = value;
      }
    });

    return config;
  }

  async files() {
    return await GetFiles(this.storage);
  }

  get storage(): string {
    if (!this._storage) this._storage = this.config.database || "";
    return this._storage;
  }

  async enter(): Promise<ListItem[]> {
    return await this.search("");
  }

  async search(word?: string): Promise<ListItem[]> {
    const inputWord = word || "";
    this.lastSearchWord = inputWord;

    // 检查是否为删除模式或清理模式（互斥，-clean 优先）
    this.isRemoveMode = false;
    this.isCleanMode = false;

    if (inputWord.includes("-clean")) {
      this.isCleanMode = true;
    } else if (inputWord.includes("-rm")) {
      this.isRemoveMode = true;
    }

    // 从搜索词中移除模式标识
    let searchWord = inputWord;
    if (this.isRemoveMode) {
      searchWord = inputWord.replace(/-rm/g, "").trim();
    }
    if (this.isCleanMode) {
      searchWord = inputWord.replace(/-clean/g, "").trim();
      return this.searchCleanItems(inputWord, searchWord);
    }

    this.resetCleanScan();

    let files = await this.files();
    files = this.filterFilesBySearchWord(files, searchWord);

    return this.createFileItems(files);
  }

  private filterFilesBySearchWord(files: string[], searchWord?: string): string[] {
    if (!searchWord) return files;

    return searchWord.split(/\s+/g).reduce((result, keyword) => {
      const normalizedKeyword = keyword.trim().toLowerCase();
      if (!normalizedKeyword) return result;

      return result.filter((file: string) => {
        return this.decodePath(file).toLowerCase().includes(normalizedKeyword);
      });
    }, files);
  }

  private createFileItems(files: string[]): ListItem<string>[] {
    return files.map((file: string): ListItem<string> => {
      const address = file;
      const decodedFile = this.decodePath(file);
      let itemTitle = basename(decodedFile);
      if (this.isRemoveMode) {
        itemTitle = `rm: ${itemTitle}`;
      } else if (this.isCleanMode) {
        itemTitle = `⚠ ${itemTitle}`;
      } else {
        itemTitle = `${itemTitle}`;
      }
      let item = new ListItem<string>(itemTitle, decodedFile, address);
      let ext = decodedFile.includes("remote") ? ".remote" : extname(decodedFile);
      item.icon = this.getIcon(ext);

      return item;
    });
  }

  private createCleanStatusItem(title: string, description: string, data: string): ListItem<string> {
    const item = new ListItem<string>(title, description, data);
    item.icon = "icon/icon.png";
    return item;
  }

  private searchCleanItems(inputWord: string, searchWord: string): ListItem<string>[] {
    const state = this.cleanScanState;
    if (!state || state.inputWord !== inputWord || state.searchWord !== searchWord) {
      this.startCleanScan(inputWord, searchWord);
      return [
        this.createCleanStatusItem(
          "🔍 正在扫描无效历史记录",
          "正在检查本地路径是否存在，请稍候",
          this.cleanScanningData,
        ),
      ];
    }

    if (state.status === "scanning") {
      return [
        this.createCleanStatusItem(
          "🔍 正在扫描无效历史记录",
          "正在检查本地路径是否存在，请稍候",
          this.cleanScanningData,
        ),
      ];
    }

    if (state.status === "error") {
      return [this.createCleanStatusItem("扫描失败", state.error || "请稍后重试", this.cleanErrorData)];
    }

    return this.createCleanResultItems(state.files, searchWord);
  }

  private createCleanResultItems(files: string[], searchWord: string): ListItem<string>[] {
    if (files.length === 0) {
      const description = searchWord
        ? `已完成扫描，没有找到匹配“${searchWord}”的无效本地路径`
        : "已完成扫描，可检测的本地路径都存在";
      return [this.createCleanStatusItem("未发现无效历史记录", description, this.cleanEmptyData)];
    }

    const items = this.createFileItems(files);

    // 在清理模式下，如果有无效记录，在最前面添加一个"清理全部"的条目
    const cleanAllItem = new ListItem<string>(
      `🧹 清理全部 ${items.length} 条无效记录`,
      `确定要删除全部 ${items.length} 条无效历史记录吗？`,
      this.cleanAllData,
    );
    cleanAllItem.icon = "icon/icon.png";
    items.unshift(cleanAllItem);

    return items;
  }

  private startCleanScan(inputWord: string, searchWord: string): void {
    const sequence = ++this.cleanScanSequence;
    this.cleanScanState = {
      inputWord,
      searchWord,
      status: "scanning",
      files: [],
    };

    this.getInvalidLocalFiles(searchWord)
      .then((files) => {
        if (sequence !== this.cleanScanSequence) return;

        this.cleanScanState = {
          inputWord,
          searchWord,
          status: "ready",
          files,
        };

        if (this.lastSearchWord === inputWord) {
          utools.setSubInputValue(inputWord);
        }
      })
      .catch((error) => {
        if (sequence !== this.cleanScanSequence) return;

        const message = error instanceof Error ? error.message : String(error);
        console.error("扫描无效历史记录失败:", error);
        this.cleanScanState = {
          inputWord,
          searchWord,
          status: "error",
          files: [],
          error: message,
        };

        if (this.lastSearchWord === inputWord) {
          utools.setSubInputValue(inputWord);
        }
      });
  }

  private async getInvalidLocalFiles(searchWord: string): Promise<string[]> {
    const files = this.filterFilesBySearchWord(await this.files(), searchWord);
    return files.filter((file: string) => {
      const localPath = this.getLocalPath(file);
      // 只保留能解析为本地路径且路径不存在的记录（即无效记录）
      return localPath !== undefined && !existsSync(localPath);
    });
  }

  private resetCleanScan(): void {
    this.cleanScanSequence += 1;
    this.cleanScanState = undefined;
  }

  private execCmd(command: string, options: { encoding: BufferEncoding } & ExecOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, options, (err, stdout, stderr) => {
        console.log("err:", err);
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        if (err) return reject(err.message + stdout);
        if (stderr) return reject(stderr + stdout);
        return resolve(stdout);
      });
    });
  }

  private getCommandParts(command: string): string[] {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return [];

    const quotedCommand = trimmedCommand.match(/^("[^"]+")\s*(.*)$/);
    if (quotedCommand) {
      const args = quotedCommand[2].trim();
      return args ? [quotedCommand[1], args] : [quotedCommand[1]];
    }

    const windowsExecutable = trimmedCommand.match(/^(.*?\.(?:exe|cmd|bat|ps1))(?:\s+(.*))?$/i);
    if (windowsExecutable) {
      const executable = windowsExecutable[1].includes(" ") ? `"${windowsExecutable[1]}"` : windowsExecutable[1];
      const args = (windowsExecutable[2] || "").trim();
      return args ? [executable, args] : [executable];
    }

    const firstOptionIndex = trimmedCommand.search(/\s-/);
    if (firstOptionIndex !== -1) {
      const executable = trimmedCommand.slice(0, firstOptionIndex).trim();
      const args = trimmedCommand.slice(firstOptionIndex).trim();
      return [executable, args];
    }

    return [trimmedCommand.includes(" ") ? `"${trimmedCommand}"` : trimmedCommand];
  }

  private decodePath(path: string): string {
    try {
      return decodeURIComponent(path);
    } catch (error) {
      console.error("路径解码失败:", error);
      return path;
    }
  }

  private getLocalPath(path: string): string | undefined {
    const trimmedPath = path.trim();
    const decodedPath = this.decodePath(trimmedPath);
    if (/^vscode-remote:\/\//i.test(decodedPath)) return undefined;

    if (/^file:/i.test(trimmedPath)) {
      const windowsDriveFileUri = trimmedPath.match(/^file:\/+([a-zA-Z])(?::|%3A)([\\/].*)?$/i);
      if (windowsDriveFileUri) {
        return `${windowsDriveFileUri[1]}:${this.decodePath(windowsDriveFileUri[2] || "")}`;
      }

      const normalizedPath = trimmedPath.replace(/^file:\/{4}(?=[a-zA-Z](?::|%3A))/i, "file:///");
      try {
        return fileURLToPath(normalizedPath);
      } catch (error) {
        console.error("解析本地路径失败:", error);
        return undefined;
      }
    }

    if (/^[a-zA-Z]:[\\/]/.test(decodedPath) || decodedPath.startsWith("\\\\") || decodedPath.startsWith("/")) {
      return decodedPath;
    }

    return undefined;
  }

  private notifyIfPathMissing(path: string): boolean {
    const localPath = this.getLocalPath(path);
    if (!localPath || existsSync(localPath)) return false;

    utools.showNotification(`路径不存在，已取消启动: ${localPath}`);
    return true;
  }

  select(item: ListItem<string>) {
    // 如果是删除模式，执行删除操作
    if (this.isRemoveMode) {
      this.handleRemoveOperation(item);
      return;
    }

    // 如果是清理模式，执行清理操作
    if (this.isCleanMode) {
      this.handleCleanOperation(item);
      return;
    }

    if (this.notifyIfPathMissing(item.data)) {
      return;
    }

    // 原有的打开 VSCode 逻辑
    let cmds: string[] = this.getCommandParts(this.config.command);
    if (item.data.includes(".code-workspace")) cmds.push("--file-uri");
    else cmds.push("--folder-uri");

    cmds.push(`"${item.data}"`);

    let cmd = cmds.join(" ");
    let shell = this.config.terminal;
    if (shell.trim()) cmd = `${shell} "env; ${cmd}"`;
    console.log(cmd);

    let timeout = parseInt(this.config.timeout);
    if (!timeout || timeout < 3000) timeout = 3000;

    this.execCmd(cmd, {
      timeout: timeout,
      windowsHide: true,
      encoding: "utf-8",
      env: this.getShellEnv(),
    })
      .then((res) => {
        utools.hideMainWindow();
      })
      .catch((reason) => {
        alert(reason);
      });
  }

  // 获取当前 shell 的环境变量（适用于 macOS/Linux）
  getShellEnv() {
    if (utools.isWindows()) {
      return process.env;
    }

    let shell = this.config.terminal.split(" ")[0].trim();
    shell = shell || process.env.SHELL;
    // 获取所有环境变量
    const envStr = execSync(`${shell} -i -c "env"`).toString();

    const env = process.env;
    envStr.split("\n").forEach((line) => {
      const [key, value] = line.split("=", 2);
      if (key && value) env[key] = value;
    });

    return env; // 合并 Node 和 Shell 的环境变量
  }

  /**
   * 处理删除操作
   * @param item 要删除的项目
   */
  private handleRemoveOperation(item: ListItem<string>) {
    // 显示确认对话框
    const fileName = decodeURIComponent(item.data);
    const confirmed = this.showConfirmDialog(fileName);

    if (!confirmed) {
      return;
    }

    // 异步删除操作
    this.performDelete(item.data, fileName);
  }

  /**
   * 执行删除操作
   * @param itemData 原始数据
   * @param fileName 解码后的文件名
   */
  private async performDelete(itemData: string, fileName: string) {
    try {
      // 调用 DeleteFiles 删除指定的历史记录
      const success = await DeleteFiles(this.storage, itemData);

      if (success) {
        // 删除成功，显示成功消息
        utools.showNotification(`已删除历史记录: ${basename(fileName)}`);
      } else {
        // 未找到记录
        utools.showNotification(`未找到要删除的记录: ${basename(fileName)}`);
      }
    } catch (error) {
      // 删除失败，显示错误消息
      console.error("删除历史记录失败:", error);
      utools.showNotification(`删除失败: ${error.message}`);
    }

    utools.setSubInputValue("-rm");
  }

  /**
   * 处理清理操作（批量/单个删除无效历史记录）
   * @param item 要清理的项目（"__clean_all__" 表示清理全部）
   */
  private async handleCleanOperation(item: ListItem<string>) {
    if (item.data === this.cleanScanningData) {
      utools.showNotification("正在扫描无效历史记录，请稍候");
      return;
    }

    if (item.data === this.cleanEmptyData) {
      return;
    }

    if (item.data === this.cleanErrorData) {
      utools.showNotification("无效历史记录扫描失败，请重新输入 -clean 重试");
      return;
    }

    if (item.data === this.cleanAllData) {
      const fileName = `全部无效历史记录`;
      const confirmed = this.showConfirmDialog(fileName);
      if (!confirmed) return;

      try {
        const files = await this.files();
        const invalidPaths = files.filter((f: string) => {
          const localPath = this.getLocalPath(f);
          return localPath !== undefined && !existsSync(localPath);
        });

        if (invalidPaths.length === 0) {
          utools.showNotification("没有需要清理的无效记录");
          return;
        }

        const count = await DeleteMultipleFiles(this.storage, invalidPaths);
        utools.showNotification(`已清理 ${count} 条无效历史记录`);
        this.resetCleanScan();
      } catch (error) {
        console.error("批量清理失败:", error);
        utools.showNotification(`清理失败: ${error.message}`);
      }

      utools.setSubInputValue("-clean");
    } else {
      const fileName = decodeURIComponent(item.data);
      const confirmed = this.showConfirmDialog(fileName);
      if (!confirmed) return;

      try {
        await DeleteFiles(this.storage, item.data);
        utools.showNotification(`已删除无效记录: ${basename(fileName)}`);
        this.resetCleanScan();
      } catch (error) {
        console.error("删除无效记录失败:", error);
        utools.showNotification(`删除失败: ${error.message}`);
      }

      utools.setSubInputValue("-clean");
    }
  }

  /**
   * 显示确认删除对话框
   * @param fileName 文件名
   * @returns 用户是否确认删除
   */
  private showConfirmDialog(fileName: string): boolean {
    // 使用 confirm 对话框确认删除操作
    return confirm(`确定要删除历史记录吗？\n\n${fileName}`);
  }

  getIcon(ext: string): string {
    let icons = readdirSync(join(__dirname, "icon"));
    let icon = icons.find((icon) => {
      return "." + icon.split(".")[0] === ext.toLowerCase();
    });
    if (!icon && !ext) icon = "folder.svg";
    if (!icon && ext) icon = "file.svg";
    return join("icon", icon);
  }
}
