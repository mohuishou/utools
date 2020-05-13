import { DBItem } from "utools-helper/@types/utools";
import { OTPItem, OTP } from "./otp";
import Item from "./item";
import { EnterKey, resetEnterKey } from "./key";
import { clipboard } from "electron";
import { Plugin, ListItem } from "utools-helper";

let operates = {
  command: (item: Item<DBItem<OTP>>) => {
    let res = utools.db.remove(item.data._id);
    let msg = "删除成功";
    if (!res.ok) msg = "删除失败: " + res.error;
    console.log(res, item);
    utools.showNotification(msg);
  },

  enter: (item: Item<DBItem<OTP>>) => {
    clipboard.writeText(item.data.data.token);
    utools.showNotification(item.data.data.token + "复制成功");
  },
};

export class Search implements Plugin {
  code = "otp";

  async search(word: string): Promise<ListItem[]> {
    let items = OTPItem.search(word);
    return items.map(
      (item: DBItem<OTP>): ListItem => {
        let otp = <OTP>item.data;
        let res = new Item<DBItem<OTP>>(item._id, item);
        res.description = otp.token + " (enter: 复制, command/ctrl + enter: 删除)";
        return res;
      }
    );
  }

  select(item: ListItem): Promise<ListItem[]> {
    operates[EnterKey as keyof typeof operates](item);
    resetEnterKey();
    if (EnterKey === "command") return this.search("");
    if (EnterKey === "enter") {
      utools.hideMainWindow();
      utools.outPlugin();
    }
  }
}
