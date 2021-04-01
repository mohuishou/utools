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
      if (typeof file === "object" && "configURIPath" in file) {
        file = file.configURIPath;
      }
      if (typeof file === "object" && ("folderUri" in file || "fileUri" in file)) {
        file = file.folderUri || file.fileUri;
      }
      return decodeURIComponent(file);
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
    let cmd =
      Setting.Get("shell") + ` '"${Setting.Get("code")}" --folder-uri "${item.description}"'`;
    let res = execSync(cmd, { timeout: 3000 }).toString().trim().toLowerCase();
    if (res !== "" && !res.toLowerCase().includes("timeout")) throw res.toString();

    utools.outPlugin();
    utools.hideMainWindow();
  }
}
