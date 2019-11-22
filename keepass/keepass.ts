import { Kdbx, Credentials, ProtectedValue, Group, Entry } from "kdbxweb";
import { readFileSync, accessSync } from "fs";
import { F_OK } from "constants";

function findEntries(group: Group, keyword: string): Entry[] {
  let entries = group.entries.filter(entry => {
    for (const key in entry.fields) {
      if (entry.fields[key].includes(keyword)) return true;
    }
    return false;
  });
  group.groups.forEach(g => {
    entries.push(...findEntries(g, keyword));
  });
  return entries;
}

class keepass {
  db: Kdbx;

  constructor(db: Kdbx) {
    this.db = db;
  }

  static async load(file, password, keyFile = null) {
    let keyFileBuf;
    if (!this.checkFile(file)) throw "文件不存在";
    if (keyFile && !this.checkFile(keyFile)) throw "文件不存在";
    if (keyFile) keyFileBuf = readFileSync(keyFile).buffer;
    let cred = new Credentials(ProtectedValue.fromString(password), keyFileBuf);
    return new keepass(await Kdbx.load(readFileSync(file).buffer, cred));
  }

  search(keyword: string): Entry[] {
    return findEntries(this.db.getDefaultGroup(), keyword);
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
}
