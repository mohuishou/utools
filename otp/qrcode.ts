import {
  TplFeatureArgsEnter,
  TplFeatureArgs,
  TplFeatureArgsSelect
} from "../@types/utools";
import jsQR, { QRCode } from "jsqr";
import { OTPItem, OTP } from "./otp";

export class AddQrcode implements TplFeatureArgs {
  placeholder = "请输入";
  otp: OTPItem;
  enter: TplFeatureArgsEnter = async (action, cb) => {
    try {
      let r = await this.qrRead(action.payload);
      if (!r) throw new Error("二维码识别失败");
      let uri = new URL(decodeURIComponent(r.data));
      this.otp = new OTPItem(
        new OTP(uri.searchParams.get("issuer"), uri.searchParams.get("secret"))
      );
      this.otp.save();
      cb([
        {
          title: "保存成功，回车查看",
          description: "保存成功，回车查看",
          name: this.otp.data.name
        }
      ]);
    } catch (error) {
      console.log(action);
      console.log(error);
      cb([
        {
          title: "错误: " + error.message,
          description: error.message
        }
      ]);
    }
  };

  select: TplFeatureArgsSelect = (action, item, cb) => {
    utools.redirect("otp", item.name);
  };

  qrRead(base64: string): Promise<QRCode> {
    return new Promise<QRCode>((resolve, reject) => {
      const image = document.createElement("img");
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        try {
          const imageData = context.getImageData(
            0,
            0,
            image.width,
            image.height
          );
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );
          resolve(qrCode);
        } catch (e) {
          reject(e);
        }
      };
      image.src = base64;
    });
  }
}
