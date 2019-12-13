import {
  TplFeatureArgsEnter,
  TplFeatureArgsSearch,
  TplFeatureArgs,
  TplFeatureArgsSelect
} from "../@types/utools";
import { OTPItem, OTP } from "./otp";

export class Add implements TplFeatureArgs {
  placeholder = "请输入";
  item: OTPItem;
  enter: TplFeatureArgsEnter = (action, cb) => {
    this.item = new OTPItem(new OTP("", ""));
    this.search(action, "", cb);
  };

  search: TplFeatureArgsSearch = (action, word, cb) => {
    let msg = "请输入名称: " + word;
    if (this.item.data.name) {
      msg = "请输入secret: " + word;
    }

    cb([
      {
        title: msg,
        description: msg,
        word: word
      }
    ]);
  };

  select: TplFeatureArgsSelect = (action, item, cb) => {
    if (!this.item.data.name) {
      this.item.data.name = item.word;
      utools.setSubInputValue("");
      return this.search(action, "", cb);
    }

    this.item.data.secret = item.word;
    let res = this.item.save();
    if (!res.ok) {
      cb([
        {
          title: "保存失败",
          description: res.error
        }
      ]);
    }

    utools.redirect("otp", "");
  };
}
