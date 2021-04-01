import { InitPlugins, Setting } from "utools-helper";
import { config } from "./config";
import { VSCode } from "./vscode";

try {
  InitPlugins([new VSCode(), Setting.Init("vsc-setting", config)]);
} catch (error) {
  alert(error.stack ? error.stack : error);
}
