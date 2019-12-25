import { InitPlugins } from "../lib/plugin";
import { Search } from "./search";
import { Add } from "./add";
import { Qrcode } from "./qrcode";
import "./key";

try {
  InitPlugins([new Qrcode(), new Add(), new Search()]);
} catch (error) {
  alert(error.message + error.stack);
}
