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
            token: otp.token
          };
        }
      )
    );
  };

  select: FeatureArgsSelect = (action, item, cb) => {
    utools.hideMainWindow();
    clipboard.writeText(item.token);
    utools.showNotification("复制成功", "otp");
    utools.outPlugin();
  };
}
