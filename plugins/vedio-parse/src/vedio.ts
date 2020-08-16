import { Plugin, IListItem, ListItem, Setting } from "utools-helper";

export class Vedio implements Plugin {
  code = "vedio";
  placeholder = "请输入视频网站地址，默认获取当前浏览器地址";

  async enter(): Promise<IListItem[]> {
    return this.search(utools.getCurrentBrowserUrl());
  }

  async search(word: string): Promise<IListItem[]> {
    if (!word) word = "请在浏览器页面中打开，或输入视频链接";
    let sources: string[] = Setting.Get("sources").split(/\n+/g);
    return sources
      .map((s) => {
        let [key, source] = s.trim().split("@");
        if (!source) {
          utools.showNotification(`视频解析源 ${key} 格式错误`);
          return;
        }
        let url = source.trim() + encodeURIComponent(word);
        return new ListItem(key.trim() + ": " + word, url, url);
      })
      .filter((item) => item);
  }

  select(item: IListItem) {
    utools.shellOpenExternal(item.data);
    utools.outPlugin();
    utools.hideMainWindow();
  }
}
