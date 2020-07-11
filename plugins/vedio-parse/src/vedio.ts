import { Plugin, IListItem, ListItem } from "utools-helper";

// sources 视频源列表
const sources: { [key: string]: string } = {
  "618G免费解析": "https://jx.618g.com/?url=",
  "8090g": "https://www.8090g.cn/jiexi/?url=",
  石头解析: "https://jiexi.071811.cc/jx.php?url=",
  接口A: "http://jx.598110.com/?url=",
  接口B: "http://vip.jlsprh.com/?url=",
};

export class Vedio implements Plugin {
  code = "vedio";
  placeholder = "请输入视频网站地址，默认获取当前浏览器地址";

  async enter(): Promise<IListItem[]> {
    return this.search(utools.getCurrentBrowserUrl());
  }

  async search(word: string): Promise<IListItem[]> {
    let items: IListItem[] = [];
    for (const key in sources) {
      items.push(
        new ListItem(
          key + ":" + word,
          sources[key],
          sources[key] + encodeURIComponent(word)
        )
      );
    }
    return items;
  }

  select(item: IListItem) {
    utools.shellOpenExternal(item.data);
    utools.outPlugin();
    utools.hideMainWindow();
  }
}
