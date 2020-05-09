import { Plugin } from "utools-helper";
import { TplFeatureMode, Action } from "utools-helper/@types/utools";

export function GetProfilePathID(): string {
  return utools.getLocalId() + ".profile";
}

export class Setting implements Plugin {
  code = "ch-setting";
  mode: TplFeatureMode = "none";

  enter(action: Action) {
    let item = utools.db.get<string>(GetProfilePathID());
    if (!item) item = { _id: GetProfilePathID(), data: "" };
    item.data = action.payload[0].path;
    let res = utools.db.put(item);
    if (res.ok)
      utools.showNotification("chrome history profile change success");
    else utools.showNotification("失败: " + res.error);
    utools.redirect("ch", "");
  }
}
