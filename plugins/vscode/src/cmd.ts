import { Plugin } from "utools-helper";
import { Action, TplFeatureMode } from "utools-helper/@types/utools";

export function GetPath(): string {
  let item = utools.db.get<string>(getID());
  if (item && item.data) return item.data;
  return "code";
}

function getID(): string {
  return utools.getLocalId() + "path";
}

export class CMD implements Plugin {
  mode: TplFeatureMode = "none";
  code = "vsc-path";
  enter(action: Action) {
    let item = utools.db.get<string>(getID());
    if (!item) {
      item = {
        _id: getID(),
        data: action.payload[0].path,
      };
    }
    item.data = action.payload[0].path;
    let res = utools.db.put(item);
    if (res.ok) {
      utools.showNotification("vscode path 设置成功", "vsc-setting");
    } else {
      utools.showNotification("vscode path 设置失败");
    }
    utools.redirect("vsc", "");
  }
}
