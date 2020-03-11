import { OTPItem, OTP } from "./otp";
import { Plugin, ListItem } from "utools-helper";

export class Add implements Plugin {
  code = "otpAdd";
  item: OTPItem;
  async enter(): Promise<ListItem[]> {
    this.item = new OTPItem(new OTP("", ""));
    return this.search();
  }
  async search(word: string = ""): Promise<ListItem[]> {
    let msg = "请输入名称: " + word;
    if (this.item.data.name) {
      msg = "请输入secret: " + word;
    }
    return [new ListItem(msg, word)];
  }
  select(item: ListItem): Promise<ListItem[]> {
    if (!this.item.data.name) {
      this.item.data.name = item.data;
      utools.setSubInputValue("");
      return this.search();
    }
    this.item.data.secret = item.data;
    let res = this.item.save();
    console.log(res);

    if (!res.ok) throw new Error("保存失败");
    utools.redirect("otp", "");
  }
}
