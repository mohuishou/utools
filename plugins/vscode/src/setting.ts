import { Plugin, ListItem } from "utools-helper";
import { GetStorage } from "./storage";
import { GetPath } from "./cmd";
import { clipboard } from "electron";

export class Setting implements Plugin {
  code = "vsc-setting";
  placeholder = "回车复制路径";

  async enter(): Promise<ListItem[]> {
    return [
      new ListItem("storage.json 路径", GetStorage()),
      new ListItem("vscode path 路径", GetPath())
    ];
  }

  select(item: ListItem) {
    clipboard.writeText(item.data);
    utools.showNotification(`复制 ${item.title} 成功`);
    utools.hideMainWindow();
    utools.outPlugin();
  }
}
