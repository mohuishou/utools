import { Template } from "../@types/utools";
import { Search, Add, AddQrcode } from "./otp";
try {
  let plugins: Template = {
    otp: {
      mode: "list",
      args: new Search()
    },
    otpAdd: {
      mode: "list",
      args: new Add()
    },
    otpQrcode: {
      mode: "none",
      args: new AddQrcode()
    }
  };
  window.exports = plugins;
} catch (error) {
  alert(error.message + error.stack);
}
