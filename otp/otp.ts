import {
  FeatureArgs,
  FeatureArgsSearch,
  FeatureArgsSelect,
  DBItem,
  CallbackListItem,
  FeatureArgsEnter
} from "../@types/utools";
import { totp, Encoding, TotpOptions } from "speakeasy";
import { clipboard } from "electron";
import jsQR from "jsqr";

class Item implements DBItem<OTP> {
  _id: string;
  _rev: string;
  data: OTP;

  constructor(name: string, secret: string) {
    this._id = name;
    this.data = new OTP(name, secret);

    let data = utools.db.get(this._id);
    if (data) this._rev = data._rev;
  }

  set name(name: string) {
    name = name.trim();
    this._id = name;
    this.data.name = name;
  }

  save() {
    console.log(this);

    return utools.db.put<OTP>(this);
  }

  static search(name: string = ""): DBItem<OTP>[] {
    return utools.db.allDocs<OTP>(name);
  }
}

class OTP {
  name: string;
  secret: string;
  encoding: Encoding = "base32";

  constructor(name: string, secret: string) {
    this.name = name;
    this.secret = secret;
  }

  get time(): number {
    return new Date().getTime() / 1000;
  }

  get token(): string {
    return totp(this as TotpOptions);
  }
}

export class Search implements FeatureArgs {
  placeholder = "请输入关键词搜索";
  enter: FeatureArgsEnter = (action, cb) => {
    this.search(action, "", cb);
  };

  search: FeatureArgsSearch = (action, word, cb) => {
    let items = Item.search(word);
    cb(
      items.map(
        (item: DBItem<OTP>): CallbackListItem => {
          let otp = new OTP(item.data.name, item.data.secret);
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

export class Add implements FeatureArgs {
  placeholder = "请输入";
  otp: Item;
  enter: FeatureArgsEnter = (action, cb) => {
    this.otp = new Item("", "");
    this.search(action, "", cb);
  };

  search: FeatureArgsSearch = (action, word, cb) => {
    let msg = "请输入名称: " + word;
    if (this.otp.data.name) {
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

  select: FeatureArgsSelect = (action, item, cb) => {
    if (!this.otp._id) {
      this.otp.name = item.word;
      utools.setSubInputValue("");
      return this.search(action, "", cb);
    }

    this.otp.data.secret = item.word;
    let res = this.otp.save();
    if (!res.ok) {
      cb([
        {
          title: "保存失败",
          description: res.error
        }
      ]);
    }
    //content 为object类型
    utools.redirect("otp", this.otp.name);
  };
}

export class AddQrcode implements FeatureArgs {
  placeholder = "请输入";
  otp: Item;
  enter: FeatureArgsEnter = (action, cb) => {
    console.log("enter", action);
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = document.createElement("img");
    document.body.appendChild(img);
    img.onload = function() {
      ctx.drawImage(img, 0, 0); // Or at whatever offset you like
      let data = ctx.getImageData(0, 0, img.width, img.height);
      document.body.appendChild(canvas);
      console.log(canvas, img, data);
      let res = jsQR(data.data, data.width, data.height);
      console.log(res);
    };
    img.src = action.payload;
  };

  search: FeatureArgsSearch = (action, word, cb) => {
    console.log(action);
  };

  select: FeatureArgsSelect = (action, item, cb) => {};
}
