import { Plugin, ListItem } from "utools-helper";
import { join, basename } from "path";
import { readFileSync } from "fs";

export class VSCode implements Plugin {
  code = "vsc";
  storage: string;

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

  async enter() {
    this.storage = join(utools.getPath("appData"), "Code", "storage.json");
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
      (file: any): ListItem => new ListItem(basename(file), file, file)
    );
  }

  select(item: ListItem) {
    let cmd = `bash -l -c 'code "${item.description}"'`;
    if (process.platform == "win32") {
      cmd = `code "${item.description}"`;
    }
    let res = require("child_process").execSync(cmd);
    if (res.toString() !== "") throw res.toString();
    utools.outPlugin();
  }
}
