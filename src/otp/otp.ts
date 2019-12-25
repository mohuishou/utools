import "reflect-metadata";
import "es6-shim";
import { plainToClass } from "class-transformer";
import { totp, Encoding, TotpOptions } from "speakeasy";
import { DBItem } from "../../@types/utools";

export class OTPItem implements DBItem<OTP> {
  _id: string;
  _rev: string;
  data: OTP;

  ok?: Boolean;
  error?: string;

  constructor(otp: OTP) {
    this._id = otp.name;
    this.data = otp;

    let data = utools.db.get(this._id);
    if (data) this._rev = data._rev;
  }

  save() {
    if (!this._id) this._id = this.data.name;
    let res = utools.db.put<OTP>(this);
    if (!res.ok) {
      throw res.error;
    }
    return res;
  }

  static search(name: string): OTPItem[] {
    return utools.db.allDocs<OTP>(name).map(
      (item: DBItem<OTP>): OTPItem => {
        item.data = plainToClass(OTP, item.data);
        return item as OTPItem;
      }
    );
  }
}

export class OTP {
  name: string;
  secret: string;
  encoding: Encoding = "base32";

  constructor(name: string, secret: string) {
    this.name = name;
    this.secret = secret;
  }

  get now(): number {
    return new Date().getTime() / 1000;
  }

  get token(): string {
    return totp(this as TotpOptions);
  }
}
