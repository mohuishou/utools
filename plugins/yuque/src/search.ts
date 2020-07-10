import { Plugin, ListItem, IListItem } from "utools-helper";
import { Client } from "./yuque";
import * as remark from "remark";

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
  private _token: string;

  async enter(): Promise<IListItem[]> {
    if (!this.token)
      return [
        {
          title: "尚未设置token，回车前往设置，使用方法请查看插件介绍",
          description: "尚未设置token，请设置",
          data: "",
          operate: "setToken",
          icon: "icon.png",
        },
      ];
    this.client = new Client(this.token);

    return this.search("");
  }

  get token(): string {
    if (!this._token) {
      let res = utools.db.get("token");
      if (res) this._token = res.data;
    }
    return this._token;
  }

  async search(word: string): Promise<IListItem[]> {
    if (!word.trim()) return [new ListItem("请输入关键词搜索")];
    let data = await this.client.search({ q: word.trim() });
    return data.data.map(
      (item: any): IListItem => {
        return new ListItem(
          item.title.replace(/<em>/gi, "").replace(/<\/em>/gi, ""),
          `【${item.info}】` +
            item.summary.replace(/<em>/gi, "").replace(/<\/em>/gi, ""),
          item
        );
      }
    );
  }

  async select(item: IListItem): Promise<IListItem[]> {
    if (!item.operate) {
      return [
        {
          title: "查看文档",
          description: item.title,
          data: item.data,
          operate: "open",
          icon: "icon/browser.png",
        },
        {
          title: "复制最新编辑版本为 markdown",
          description: item.title,
          data: item.data,
          operate: "copyMarkdown",
          icon: "icon/markdown.png",
          draft: true,
        },
        {
          title: "复制已发布版本为 markdown",
          description: item.title,
          data: item.data,
          operate: "copyMarkdown",
          icon: "icon/markdown.png",
          draft: false,
        },
      ];
    }

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
    data = data
      .replace(/<br\s*\/>/gi, "\n")
      .replace(/<a name=".*"><\/a>/gi, "\n");

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
    // utools.outPlugin();
    // utools.hideMainWindow();
  }

  async open(item: IListItem) {
    utools.shellOpenExternal("https://www.yuque.com" + item.data.url);
    utools.outPlugin();
    utools.hideMainWindow();
  }

  async setToken(item: IListItem) {
    utools.redirect("语雀设置", "");
  }
}
