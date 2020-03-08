import { Bookmarks } from "./bookmarks";
import { join } from "path";
import { existsSync } from "fs";
import * as bplist from "bplist-parser";
import { execSync } from "child_process";

export class BookMarksMac implements Bookmarks {
  async getBookMarks(): Promise<Array<string>> {
    let path = join(utools.getPath("appData"), "SourceTree", "browser.plist");

    let arr = await bplist.parseFile(path);
    return arr[0]["$objects"].filter((item: any) => {
      return typeof item === "string" && existsSync(item);
    });
  }

  open(path: string) {
    execSync("open -a SourceTree " + path);
  }
}
