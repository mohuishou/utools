import { Plugin, ListItem } from "utools-helper";
import { basename, join, extname } from "path";
import { readdirSync } from "fs";
import { ExecOptions, exec } from "child_process";
import { GetFiles } from "./files";
import { Config, GetConfig, SaveConfig } from "./setting";
import { Action } from "utools-helper/dist/template_plugin";


export class VSCode implements Plugin {
  code = "vsc";
  _storage: string;
  delay = 100;
  config: Config;

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

    return items;
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

  select(item: ListItem<string>) {
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
