import { InitPlugins } from "utools-helper";
import { VSCode } from "./vscode";
import { Setting } from "./setting";
import { Storage } from "./storage";

InitPlugins([new VSCode(), new Setting(), new Storage()]);
