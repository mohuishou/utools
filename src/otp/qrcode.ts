import { Action } from "../../@types/utools";
import jsQR, { QRCode } from "jsqr";
import { OTPItem, OTP } from "./otp";
import { Plugin, ListItem } from "../lib/plugin";

export class Qrcode implements Plugin {
  code = "otpQrcode";
  otp: OTPItem;

  async enter(action: Action): Promise<ListItem[]> {
    let r = await new qrcodeFromURL(action.payload).decode();
    let uri = new URL(decodeURIComponent(r.data));
    this.otp = new OTPItem(new OTP(uri.searchParams.get("issuer"), uri.searchParams.get("secret")));
    this.otp.save();
    return [new ListItem("保存成功，回车查看", this.otp._id)];
  }

  async select(item: ListItem): Promise<ListItem[]> {
    utools.redirect("otp", item.data);
    return;
  }
}

class qrcodeFromURL {
  base64: string;
  img: HTMLImageElement;

  constructor(base64: string) {
    this.base64 = base64;
    this.img = document.createElement("img");
  }

  async decode(): Promise<QRCode> {
    await this.onload();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = this.img.width;
    canvas.height = this.img.height;
    context.drawImage(this.img, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
    if (!qrCode) throw new Error("二维码识别失败，请确认这是一个二维码图片");
    return qrCode;
  }

  async onload() {
    return new Promise<any>((resolve, reject) => {
      this.img.onload = resolve;
      this.img.src = this.base64;
    });
  }
}
