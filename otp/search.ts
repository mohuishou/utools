import {
  TplFeatureArgsEnter,
  TplFeatureArgsSearch,
  TplFeatureArgs,
  DBItem,
  CallbackListItem,
  TplFeatureArgsSelect
} from "../@types/utools";
import { OTPItem, OTP } from "./otp";
import Item from "./item";
import { EnterKey, resetEnterKey } from "./key";
import { clipboard } from "electron";

let operates = {
  command: (item: Item<DBItem<OTP>>) => {
    let res = utools.db.remove(item.data._id);
    let msg = "删除成功";
    if (!res.ok) msg = "删除失败: " + res.error;
    console.log(res, item);
    utools.showNotification(msg, "otp");
  },

  enter: (item: Item<DBItem<OTP>>) => {
    clipboard.writeText(item.data.data.token);
    utools.showNotification("复制成功", "otp");
  }
};
export class Search implements TplFeatureArgs {
  placeholder = "请输入关键词搜索";

  enter: TplFeatureArgsEnter = (action, cb) => {
    this.search(action, "", cb);
  };

  search: TplFeatureArgsSearch = (action, word, cb) => {
    let items = OTPItem.search(word);
    cb(
      items.map(
        (item: DBItem<OTP>): CallbackListItem => {
          let otp = <OTP>item.data;
          let res = new Item<DBItem<OTP>>(item._id, item);
          res.description = otp.token;
          return res;
        }
      )
    );
  };

  select: TplFeatureArgsSelect = (action, item: Item<DBItem<OTP>>, cb) => {
    utools.hideMainWindow();
    operates[EnterKey as keyof typeof operates](item);
    resetEnterKey();
    utools.outPlugin();
  };
}
