import { Plugin, ListItem } from "utools-helper";
import { basename, join, extname } from "path";
import { readdirSync } from "fs";
import { ExecOptions, exec, execSync } from "child_process";
import { GetFiles, DeleteFiles } from "./files";
import { Config, GetConfig, SaveConfig } from "./setting";
import { Action } from "utools-helper/dist/template_plugin";


export class VSCode implements Plugin {
  code = "vsc";
  _storage: string;
  delay = 100;
  config: Config;
  private isRemoveMode = false;

  constructor(code: string) {
    this.code = code;
    this.config = GetConfig(this.code);
  }

  async files() {
    return await GetFiles(this.storage);
  }

  get storage(): string {
    if (!this._storage) this._storage = this.config.database;
    return this._storage;
  }

  async enter(): Promise<ListItem[]> {
    return await this.search("");
  }

  async search(word?: string): Promise<ListItem[]> {
    let files = await this.files();

    // 检查是否为删除模式
    this.isRemoveMode = word && word.includes("-rm");
    
    // 如果是删除模式，从搜索词中移除 -rm 标识
    let searchWord = word;
    if (this.isRemoveMode) {
      searchWord = word.replace(/-rm/g, "").trim();
    }

    // 搜索
    if (searchWord) {
      searchWord.split(/\s+/g).forEach((keyword) => {
        if (keyword.trim()) {
          files = files.filter((file: string) => {
            return decodeURIComponent(file)
              .toLowerCase()
              .includes(keyword.trim().toLowerCase());
          });
        }
      });
    }

    let items = files.map(
      (file: any): ListItem => {
        let address = file;
        file = decodeURIComponent(file);
        let itemTitle = basename(file);
        if (this.isRemoveMode) {
          itemTitle = `删除: ${itemTitle}`;
        }
        else {
          itemTitle = `打开: ${itemTitle}`;
        }
        let item = new ListItem<string>(itemTitle, file, address);
        let ext = file.includes("remote") ? ".remote" : extname(file);
        item.icon = this.getIcon(ext);
        
        
        return item;
      }
    );

    return items;
  }

  private execCmd(
    command: string,
    options: { encoding: BufferEncoding } & ExecOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, options, (err, stdout, stderr) => {
        console.log("err:", err)
        console.log("stdout:", stdout)
        console.log("stderr:", stderr)
        if (err) return reject(err.message + stdout);
        if (stderr) return reject(stderr + stdout);
        return resolve(stdout);
      });
    });
  }

  select(item: ListItem<string>) {
    // 如果是删除模式，执行删除操作
    if (this.isRemoveMode) {
      this.handleRemoveOperation(item);
      return;
    }

    // 原有的打开 VSCode 逻辑
    let code = this.config.command;
    if (code.trim().includes(" ")) code = `"${code}"`;

    let cmds: String[] = [code];
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
    }).then((res) => { utools.hideMainWindow(); })
      .catch((reason) => {
        alert(reason)
      });
  }

  // 获取当前 shell 的环境变量（适用于 macOS/Linux）
  getShellEnv() {
    if (utools.isWindows()) {
      return process.env
    }

    let shell = this.config.terminal.split(" ")[0].trim()
    shell = shell || process.env.SHELL;
    // 获取所有环境变量
    const envStr = execSync(`${shell} -i -c "env"`).toString();

    const env = process.env;
    envStr.split('\n').forEach(line => {
      const [key, value] = line.split('=', 2);
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
    
    utools.setSubInputValue("-rm")
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
    let icons = readdirSync(join(__dirname, "..", "icon"));
    let icon = icons.find((icon) => {
      return "." + icon.split(".")[0] === ext.toLowerCase();
    });
    if (!icon && !ext) icon = "folder.svg";
    if (!icon && ext) icon = "file.svg";
    return join("icon", icon);
  }
}
