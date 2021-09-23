import { Plugin, ListItem, IListItem, Setting } from "utools-helper";
import { Client, oauth } from "./yuque";
import * as remark from 'remark'

const config = require("../config.json");
// 背景色区块支持
const colorBlocks: { [key: string]: string } = {
  "^:::tips$": `<div style="background: #FFFBE6;padding:10px;border: 1px solid #C3C3C3;border-radius:5px;margin-bottom:5px;">`,
  "^:::danger$": `<div style="background: #FFF3F3;padding:10px;border: 1px solid #DEB8BE;border-radius:5px;margin-bottom:5px;">`,
  "^:::info$": `<div style="background: #E8F7FF;padding:10px;border: 1px solid #ABD2DA;border-radius:5px;margin-bottom:5px;">`,
  "^:::$": "</div>\n",
};

// Search 搜索
export class Search implements Plugin {
  code = "yuque-search";
  client: Client;
  historyRecords: IListItem[] = [new ListItem("请输入关键词搜索")];

  async enter(): Promise<IListItem[]> {
    if (!Setting.Get("token")) {
      let auth = new oauth(config.client_id, config.client_secret);
      let token = await auth.token();
      Setting.Set("token", token);
    }

    this.client = new Client(Setting.Get("token"));
    return this.search("");
  }

  async search(word: string): Promise<IListItem[]> {
    if (!word.trim()) return this.historyRecords;
    let data = await this.client.search({ q: word.trim() });
    return data.data.map(
      (item: any): IListItem => {
        return new ListItem(
          item.title.replace(/<em>/gi, "").replace(/<\/em>/gi, ""),
          `【${item.info}】` + item.summary.replace(/<em>/gi, "").replace(/<\/em>/gi, ""),
          item
        );
      }
    );
  }

  async select(item: IListItem): Promise<IListItem[]> {
    let operates = [
      {
        id: "open",
        title: "查看文档-[浏览器]",
        operate: "open",
        description: item.title,
        data: item.data,
        url: "https://www.yuque.com" + item.data.url,
        icon: "icon/browser.png",
      },
      {
        id: "edit",
        title: "编辑文档-[浏览器]",
        operate: "open",
        url: "https://www.yuque.com" + item.data.url + "/edit",
        description: item.title,
        data: item.data,
        icon: "icon/browser.png",
      },
      {
        id: "open-ubrowser",
        title: "查看文档-[弹窗]",
        operate: "openUbrowser",
        description: item.title,
        data: item.data,
        url: "https://www.yuque.com" + item.data.url,
        icon: "icon/window.png",
      },
      {
        id: "edit-ubrowser",
        title: "编辑文档-[弹窗]",
        operate: "openUbrowser",
        description: item.title,
        data: item.data,
        url: "https://www.yuque.com" + item.data.url + "/edit",
        icon: "icon/window.png",
      },
      {
        id: "copy-edit-md",
        title: "复制最新编辑版本为 markdown",
        operate: "copyMarkdown",
        description: item.title,
        data: item.data,
        icon: "icon/markdown.png",
        draft: true,
      },
      {
        title: "复制已发布版本为 markdown",
        id: "copy-public-md",
        description: item.title,
        data: item.data,
        operate: "copyMarkdown",
        icon: "icon/markdown.png",
        draft: false,
      },
    ];

    let orders: { [key: string]: number };
    orders = JSON.parse(localStorage.getItem("operates-order") || "{}");
    if (!item.operate) {
      operates.sort((a, b) => (orders[b.id] || 0) - (orders[a.id] || 0));
      this.historyRecords = this.historyRecords.filter((r) => r.data.url !== item.data.url);
      this.historyRecords.unshift(item);
      this.historyRecords = this.historyRecords.slice(0, Setting.Get("history_count"));
      return operates;
    }

    if (!orders[item.id]) orders[item.id] = 0;
    orders[item.id]++;
    localStorage.setItem("operates-order", JSON.stringify(orders));

    await this[item.operate as "open" | "copyMarkdown"](item);
  }

  async copyMarkdown(item: IListItem) {
    let data = await this.client.getDoc({
      namespace: item.data.target.book.namespace,
      slug: item.data.target.slug,
      raw: "1",
    });

    if (item.draft) data = data.data.body_draft;
    else data = data.data.body;

    // 替换语雀的无意义标签
    data = data.replace(/<br\s*\/>/gi, "\n").replace(/<a name=".*"><\/a>/gi, "\n");

    // 支持提示区块语法
    for (const key in colorBlocks) {
      data = data.replace(new RegExp(key, "igm"), colorBlocks[key]);
    }

    // 格式化并复制到剪切板
    data = remark()
      .data("settings", { commonmark: true, emphasis: "*", strong: "*" })
      .processSync(data);

    utools.copyText(String(data));
    utools.showNotification("复制成功: " + item.data.title);
    utools.outPlugin();
    utools.hideMainWindow();
  }

  async open(item: IListItem) {
    utools.shellOpenExternal(item.url);
    utools.outPlugin();
    utools.hideMainWindow();
  }

  async openUbrowser(item: IListItem) {
    utools.ubrowser
      .goto(item.url)
      .show()
      .run({
        width: Setting.Get("window_width"),
        height: Setting.Get("window_height"),
      });
    utools.outPlugin();
    utools.hideMainWindow();
  }

  async setToken(item: IListItem) {
    utools.redirect("语雀设置", "");
  }
}
