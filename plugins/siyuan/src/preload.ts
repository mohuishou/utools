import { InitPlugins, Setting } from "utools-helper";
import { config } from "./config";
import { SiYuan } from "./siyuan";

try {
  InitPlugins([new SiYuan(), Setting.Init("siyuan-setting", config)]);
} catch (error) {
  alert(error.stack ? error.stack : error);
}
