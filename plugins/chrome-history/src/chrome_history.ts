import * as initSqlJs from "sql.js";
import { readFileSync } from "fs";
import { SqlJs } from "sql.js/module";
import { join } from "path";
import { Plugin, ListItem } from "utools-helper";

export class ChromeHistory implements Plugin {
  code = "ch";
  hitoryDB: SqlJs.Database;
  faviconDB: SqlJs.Database;

  profile(): string {
    return this.getDefaultProfile();
  }

  getDefaultProfile(): string {
    let data = utools.getPath("appData");
    switch (process.platform) {
      case "darwin":
        return join(data, "Google/Chrome/Default");
      case "win32":
        return join(data, "../Local/Google/Chrome/User Data/Default");
      case "linux":
        return join(data, "google-chrome/default");
    }
  }

  async enter(): Promise<ListItem[]> {
    console.log(this.profile());

    // 初始化数据库
    let sql = await initSqlJs();
    let historyFile = readFileSync(join(this.profile(), "History"));
    this.hitoryDB = new sql.Database(historyFile);

    let faviconFile = readFileSync(join(this.profile(), "Favicons"));
    this.faviconDB = new sql.Database(faviconFile);

    return await this.search("");
  }

  async search(word?: string): Promise<ListItem[]> {
    let queries = word.trim().split(/\s+/g);
    let items: ListItem[] = [];

    // 获取历史记录
    let sql = `select * from urls`;
    queries.forEach((q) => {
      if (q === "") return;
      sql += sql.includes("where") ? " and " : " where ";
      sql += ` (title like '%${q}%' or url like '%${q}%')`;
    });
    sql += ` order by last_visit_time desc limit 50 `;
    console.log("history search sql:", sql);

    this.hitoryDB.each(
      sql,
      (row) => items.push(new ListItem(row.title as string, row.url as string)),
      () => {}
    );

    // 获取图标
    return items.map((item) => {
      let sql = `select * from favicons JOIN icon_mapping on icon_mapping.icon_id = favicons.id and page_url = '${item.description}'`;
      this.faviconDB.each(
        sql,
        (row) => {
          item.icon = row.url as string;
        },
        () => {}
      );
      return item;
    });
  }
}
