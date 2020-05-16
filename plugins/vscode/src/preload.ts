import { InitPlugins } from "utools-helper";
import { VSCode } from "./vscode";
import { Setting } from "./setting";
import { Storage } from "./storage";
import { CMD } from "./cmd";

InitPlugins([new VSCode(), new CMD(), new Setting(), new Storage()]);
