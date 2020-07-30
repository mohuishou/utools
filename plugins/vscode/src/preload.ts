import { InitPlugins } from "utools-helper";
import { VSCode } from "./vscode";
import { Setting } from "./setting";
import { Storage } from "./storage";
import { CMD } from "./cmd";

try {
  InitPlugins([new VSCode(), new CMD(), new Setting(), new Storage()]);
} catch (error) {
  alert(error.stack ? error.stack : error);
}
