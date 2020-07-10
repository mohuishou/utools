import { Plugin, ListItem, IListItem } from "utools-helper";
import { Client } from "./yuque";

export class Setting implements Plugin {
  code = "yuque-token";

  enter() {}

  async search(word: string): Promise<IListItem[]> {
    return [new ListItem("Token: " + word, word, word.trim())];
  }

  async select(item: IListItem): Promise<IListItem[]> {
    await new Client(item.data).search({ q: "test" });
    let data = utools.db.get("token");
    if (!data) data = { _id: "token", data: item.data };
    data.data = item.data;
    let result = utools.db.put(data);
    if (!result.ok) {
      utools.showNotification("设置失败" + result.error);
      return;
    }
    utools.showNotification("设置成功");
    utools.redirect("语雀搜索", "");
    utools.outPlugin();
    return;
  }
}
