import { Kdbx, Credentials, ProtectedValue, Group, Entry } from "kdbxweb";
import { readFileSync, accessSync } from "fs";
import { F_OK } from "constants";
import { ListItem, Plugin } from "utools-helper";
import { dialog, remote, webFrame } from "electron";

export class keepass implements Plugin {
  code = "keepass";

  db: Kdbx;
  passwrod: string;
  keyFile: string;
  dbFile: string;

  static async load(file: string, password: string, keyFile: string = null) {
    let keyFileBuf;
    if (!this.checkFile(file)) throw "文件不存在";
    if (keyFile && !this.checkFile(keyFile)) throw "文件不存在";
    if (keyFile) keyFileBuf = readFileSync(keyFile).buffer;
    let cred = new Credentials(ProtectedValue.fromString(password), keyFileBuf);
    await Kdbx.load(readFileSync(file).buffer, cred);
    return new keepass();
  }

  static checkFile(path: string) {
    try {
      accessSync(path, F_OK);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  async enter(): Promise<ListItem[]> {
    // 是否有密码，密钥文件等
    utools.setExpendHeight(400);
    let s = `<input type="file" />`;
    let root = document.querySelector("#root");
    root.setAttribute("style", "display:none;");
    document.body.innerHTML += s;
    return;
  }

  async search(word: string): Promise<ListItem[]> {
    this.findEntries(this.db.getDefaultGroup(), word).map(
      (entry): ListItem => {
        let items: ListItem[];
        for (const key in entry.fields) {
          items.push(new ListItem(key, entry.fields[key]));
        }

        let item = new ListItem(entry.fields["title"] as string, items);
        item.operate = "items";
        return item;
      }
    );
    return;
  }

  findEntries(group: Group, keyword: string): Entry[] {
    let entries = group.entries.filter(entry => {
      for (const key in entry.fields) {
        if (entry.fields[key].includes(keyword)) return true;
      }
      return false;
    });
    group.groups.forEach(g => {
      entries.push(...this.findEntries(g, keyword));
    });
    return entries;
  }
}
