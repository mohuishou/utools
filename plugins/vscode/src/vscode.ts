import { Plugin, ListItem } from "utools-helper";
import { join, basename } from "path";
import { readFileSync } from "fs";
import { GetPath } from "./cmd";
import { GetStorage } from "./storage";

export const STORAGE = "vscode_storage";

export class VSCode implements Plugin {
  code = "vsc";
  _storage: string;

  get files() {
    let data = JSON.parse(readFileSync(this.storage).toString());
    let files: Array<any> = [];

    for (const key in data.openedPathsList) {
      if (key.includes("workspaces") || key.includes("files")) {
        files = files.concat(data.openedPathsList[key]);
      }
    }
    files = [...new Set(files)];

    return files
      .map((file: any) => {
        if (typeof file === "object" && "configURIPath" in file) {
          file = file.configURIPath;
        }
        return decodeURIComponent(file);
      })
      .filter(file => !file.includes("vscode-remote"))
      .map(file => file.replace(/^.*?\:\/\//, ""));
  }

  get storage(): string {
    if (!this._storage) this._storage = GetStorage();
    return this._storage;
  }

  async enter() {
    return await this.search("");
  }

  async search(word?: string): Promise<ListItem[]> {
    let files = this.files;
    // 搜索
    word.split(/\s+/g).forEach(keyword => {
      files = files.filter((file: string) => {
        return file.toLowerCase().includes(keyword.trim().toLowerCase());
      });
    });

    return files.map(
      (file: any): ListItem => new ListItem(basename(file), file)
    );
  }

  select(item: ListItem) {
    let cmd = `${GetPath()} "${item.description}"`;
    if (process.platform !== "win32") {
      cmd = `bash -l -c  '${cmd}'`;
    }

    let res = require("child_process").execSync(cmd);
    if (res.toString() !== "") throw res.toString();
    utools.outPlugin();
  }
}
