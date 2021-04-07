import { Plugin, ListItem, Setting } from "utools-helper";
import { basename } from "path";
import { readFileSync } from "fs";
import { execSync } from "child_process";

export const STORAGE = "vscode_storage";

export class VSCode implements Plugin {
  code = "vsc";
  _storage: string;

  get files() {
    let data = JSON.parse(readFileSync(this.storage).toString());
    let files: Array<any> = [];

    for (const key in data.openedPathsList) {
      if (key.includes("workspaces") || key.includes("files") || key.includes("entries")) {
        files = files.concat(data.openedPathsList[key]);
      }
    }

    return [...new Set(files)].map((file: any) => {
      if (typeof file === "string") return decodeURIComponent(file);
      if (typeof file !== "object") return;

      let keys = ["configURIPath", "folderUri", "fileUri"];
      let k = keys.find((k) => k in file);
      if (k) return decodeURIComponent(file[k]);

      if ("workspace" in file) return decodeURIComponent(file.workspace.configPath);
    });
  }

  get storage(): string {
    if (!this._storage) this._storage = Setting.Get("storage");
    return this._storage;
  }

  async enter(): Promise<ListItem[]> {
    return await this.search("");
  }

  async search(word?: string): Promise<ListItem[]> {
    let files = this.files;
    // 搜索
    word.split(/\s+/g).forEach((keyword) => {
      files = files.filter((file: string) => {
        return file.toLowerCase().includes(keyword.trim().toLowerCase());
      });
    });

    return files.map((file: any): ListItem => new ListItem(basename(file), file));
  }

  select(item: ListItem) {
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
    if (res !== "" && !res.toLowerCase().includes("timeout")) throw res.toString();

    utools.outPlugin();
    utools.hideMainWindow();
  }
}
