import { InitPlugins } from "./plugin";
import { Setting } from "./config/setting";

try {
  InitPlugins([new Setting("utools-helper", [])]);
} catch (error) {
  alert(error.stack ? error.stack : error);
}
