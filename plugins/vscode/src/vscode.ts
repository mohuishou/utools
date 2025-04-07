import { Plugin, ListItem } from "utools-helper";
import { basename, join, extname } from "path";
import { readdirSync, readFileSync } from "fs";
import { ExecOptions, exec, execSync } from "child_process";
import { GetFiles } from "./files";
import { Config, GetConfig, SaveConfig } from "./setting";

export class VSCode implements Plugin {
  code = "vsc";
  _storage: string;
  isCtrl = false;
  delay = 100;
  config: Config;

  constructor(code: string) {
    this.code = code;
    this.config = GetConfig(this.code);

    document.onkeydown = (ev) => {
      if (ev.ctrlKey || ev.metaKey) {
        this.isCtrl = true;
      }
    };
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
    this.isCtrl = false;
    let files = await this.files();

    // 搜索
    word.split(/\s+/g).forEach((keyword) => {
      files = files.filter((file: string) => {
        return decodeURIComponent(file)
          .toLowerCase()
          .includes(keyword.trim().toLowerCase());
      });
    });

    let items = files.map(
      (file: any): ListItem => {
        let address = file;
        file = decodeURIComponent(file);
        let item = new ListItem<string>(basename(file), file, address);
        let ext = file.includes("remote") ? ".remote" : extname(file);
        item.icon = this.getIcon(ext);
        return item;
      }
    );

    if (!word.trim()) {
      let collects = this.getCollect();

      collects.map((item) => (item.icon = "icon/icon-collect.png"));

      // 去除已收藏的项目，避免重复显示
      items = items.filter((item) => {
        for (let i = 0; i < collects.length; i++) {
          if (item.description == collects[i].description) return false;
        }
        return true;
      });

      items = collects.concat(items);
    }

    return items;
  }

  getCollect(): ListItem[] {
    return this.config.collections || [];
  }

  saveCollect(item: ListItem) {
    let items = this.getCollect();
    item.icon = "icon/icon-collect.png";
    items.unshift(item);
    this.config.collections = items;
    SaveConfig(this.config)
    utools.showNotification(`${item.title} 已置顶`);
  }

  removeCollect(item: ListItem) {
    let items = this.getCollect();
    items = items.filter((data) => data.description != item.description);
    this.config.collections = items;
    SaveConfig(this.config)
    utools.showNotification(`${item.title} 置顶已移除`);
  }

  private execCmd(
    command: string,
    options: { encoding: BufferEncoding } & ExecOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, options, (_, stdout, stderr) => {
        if (stderr) return reject(stderr);

        resolve(stdout);
      });
    });
  }

  async select(item: ListItem<string>) {
    if (this.isCtrl) {
      let items = this.getCollect();
      let isSave = items.find((i) => i.description == item.description);
      if (isSave) this.removeCollect(item);
      else this.saveCollect(item);
      this.isCtrl = false;
      return await this.search("");
    }

    let code = this.config.command;
    if (code.trim().includes(" ")) code = `"${code}"`;

    let cmds: String[] = [code];
    if (item.data.includes(".code-workspace")) cmds.push("--file-uri");
    else cmds.push("--folder-uri");

    cmds.push(`"${item.data}"`);

    let cmd = cmds.join(" ");
    let shell = this.config.terminal;
    if (shell.trim()) cmd = `${shell} "${cmd}"`;
    console.log(cmd);

    let timeout = parseInt(this.config.timeout);
    if (!timeout || timeout < 3000) timeout = 3000;


    this.execCmd(cmd, { timeout: timeout, windowsHide: true, encoding: "utf-8", })
      .then(() => { utools.hideMainWindow(); })
      .catch((reason) => { throw reason.toString(); });
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
