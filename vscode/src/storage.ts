import { Plugin } from "utools-helper";
import { Action, TplFeatureMode } from "utools-helper/@types/utools";
import { join } from "path";

export function GetStorage(): string {
  let item = utools.db.get<string>(getStorageID());
  if (item && item.data) return item.data;
  return join(utools.getPath("appData"), "Code", "storage.json");
}

function getStorageID(): string {
  return utools.getLocalId() + "storage";
}

export class Storage implements Plugin {
  mode: TplFeatureMode = "none";
  code = "vsc-storage";
  enter(action: Action) {
    let item = utools.db.get<string>(getStorageID());
    if (!item) {
      item = {
        _id: getStorageID(),
        data: action.payload[0].path
      };
    }
    item.data = action.payload[0].path;

    let res = utools.db.put(item);
    if (res.ok) {
      utools.showNotification("storage.json 设置成功", "vsc-setting");
    } else {
      utools.showNotification("storage.json 设置失败");
      throw new Error(JSON.stringify(res));
    }
    utools.hideMainWindow();
    utools.outPlugin();
  }
}
