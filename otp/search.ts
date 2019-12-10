import {
  FeatureArgsEnter,
  FeatureArgsSearch,
  FeatureArgs,
  DBItem,
  CallbackListItem,
  FeatureArgsSelect
} from "../@types/utools";
import { clipboard } from "electron";
import { OTPItem, OTP } from "./otp";

class Operate {
  static delete(item: CallbackListItem) {
    let res = utools.db.remove(item.value);
    let msg = "删除成功";
    if (!res.ok) msg = "删除失败: " + res.error;
    utools.showNotification(msg, "otp");
  }

  static copy(item: CallbackListItem) {
    clipboard.writeText(item.value);
    utools.showNotification("复制成功", "otp");
  }
}

let items: CallbackListItem[] = [
  {
    title: "复制",
    description: "复制到剪切板",
    operate: Operate.copy
  },
  {
    title: "删除",
    description: "删除",
    operate: Operate.delete
  }
];

export class Search implements FeatureArgs {
  placeholder = "请输入关键词搜索";
  enter: FeatureArgsEnter = (action, cb) => {
    this.search(action, "", cb);
  };

  search: FeatureArgsSearch = (action, word, cb) => {
    let items = OTPItem.search(word);
    cb(
      items.map(
        (item: DBItem<OTP>): CallbackListItem => {
          let otp = <OTP>item.data;
          return {
            title: item._id,
            description: otp.token,
            operate: Operate.copy,
            value: otp.token
          };
        }
      )
    );
  };

  select: FeatureArgsSelect = (action, item, cb) => {
    utools.hideMainWindow();
    item.operate(item);
    utools.outPlugin();
  };
}
