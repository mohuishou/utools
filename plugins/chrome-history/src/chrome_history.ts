const initSqlJs = require("../lib/sql-wasm");
import { readFileSync } from "fs";
import { Database } from "sql.js";
import { join } from "path";
import { Plugin, ListItem } from "utools-helper";
import { GetProfilePathID } from "./setting";

export class ChromeHistory implements Plugin {
  code = "ch";
  hitoryDB: Database;
  faviconDB: Database;
  history: ListItem[];

  constructor() {
    this.history = [];
  }

  profile(): string {
    let item = utools.db.get(GetProfilePathID());
    if (item) return item.data;
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
    this.hitoryDB = new sql.Database(historyFile) as Database;

    let faviconFile = readFileSync(join(this.profile(), "Favicons"));
    this.faviconDB = new sql.Database(faviconFile) as Database;

    return await this.search("");
  }

  searchSync(word?: string): ListItem[] {
    let queries = word
      .trim()
      .split(/\s+/g)
      .filter((q) => q != "");

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
    items = items.map((item) => {
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

    // 如果没有查询数据，优先展示历史搜索过的内容
    if (queries.length == 0) {
      let newItems: ListItem<any>[] = [...this.history];
      newItems.push(...items);
      items = newItems;
    }

    return items;
  }

  async search(word?: string): Promise<ListItem[]> {
    return this.searchSync(word);
  }

  select(item: ListItem) {
    this.history.push(item);
    // @ts-ignore
    utools.shellOpenExternal(item.description);
  }
}
