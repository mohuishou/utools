import { Plugin, ListItem, Setting } from "utools-helper";
import { basename } from "path";
import { readdirSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { GetFiles } from "./storage.1.64";
import path = require("path");

export const STORAGE = "vscode_storage";

export class VSCode implements Plugin {
  code = "vsc";
  _storage: string;
  isCtrl = false;

  constructor() {
    document.onkeydown = (ev) => {
      if (ev.ctrlKey || ev.metaKey) {
        this.isCtrl = true;
      }
    };
  }

  /**
   * 在 1.64 版本之前获取文件列表
   */
  before164Files(data: any) {
    let files: Array<any> = [];
    for (const key in data.openedPathsList) {
      if (
        key.includes("workspaces") ||
        key.includes("files") ||
        key.includes("entries")
      ) {
        files = files.concat(data.openedPathsList[key]);
      }
    }

    return [...new Set(files)].map((file: any) => {
      if (typeof file === "string") return decodeURIComponent(file);
      if (typeof file !== "object") return;

      let keys = ["configURIPath", "folderUri", "fileUri"];
      let k = keys.find((k) => k in file);
      if (k) return decodeURIComponent(file[k]);

      if ("workspace" in file)
        return decodeURIComponent(file.workspace.configPath);
    });
  }

  get files() {
    let data = JSON.parse(readFileSync(this.storage).toString());
    if (!("openedPathsList" in data)) return GetFiles(this.storage);
    return this.before164Files(data);
  }

  get storage(): string {
    if (!this._storage) this._storage = Setting.Get("storage");
    return this._storage;
  }

  async enter(): Promise<ListItem[]> {
    return await this.search("");
  }

  async search(word?: string): Promise<ListItem[]> {
    this.isCtrl = false;
    let files = this.files;

    // 搜索
    word.split(/\s+/g).forEach((keyword) => {
      files = files.filter((file: string) => {
        return file.toLowerCase().includes(keyword.trim().toLowerCase());
      });
    });

    let items = files.map(
      (file: any): ListItem => {
        let item = new ListItem(basename(file), file);
        let ext = file.includes("remote") ? ".remote" : path.extname(file);
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
    return utools.dbStorage.getItem("collect") || [];
  }

  saveCollect(item: ListItem) {
    let items = this.getCollect();
    item.icon = "icon/icon-collect.png";
    items.unshift(item);
    utools.dbStorage.setItem("collect", items);

    utools.showNotification(`${item.title} 已置顶`);
  }

  removeCollect(item: ListItem) {
    let items = this.getCollect();
    items = items.filter((data) => data.description != item.description);
    utools.dbStorage.setItem("collect", items);
    utools.showNotification(`${item.title} 置顶已移除`);
  }

  async select(item: ListItem) {
    if (this.isCtrl) {
      let items = this.getCollect();
      let isSave = items.find((data) => data.description == item.description);
      if (isSave) this.removeCollect(item);
      else this.saveCollect(item);
      this.isCtrl = false;
      return await this.search("");
    }
    let code = Setting.Get("code");
    if (code.trim().includes(" ")) {
      code = `"${code}"`;
    }

    let cmd = `${code} --folder-uri "${item.description}"`;
    let shell = Setting.Get("shell");
    if (shell.trim()) {
      cmd = shell + ` "${cmd}"`;
    }
    let res = execSync(cmd, { timeout: 3000 }).toString().trim().toLowerCase();
    if (res !== "" && !res.toLowerCase().includes("timeout"))
      throw res.toString();

    utools.outPlugin();
    utools.hideMainWindow();
  }

  getIcon(ext: string): string {
    console.log(ext);
    let icons = readdirSync(path.join(__dirname, "..", "icon"));
    let icon = icons.find((icon) => {
      return "." + icon.split(".")[0] === ext.toLowerCase();
    });
    if (!icon && !ext) icon = "folder.svg";
    if (!icon && ext) icon = "file.svg";
    return path.join("icon", icon);
  }
}
