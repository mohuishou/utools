import { InitPlugins, Setting } from "utools-helper";
import { config } from "./config";
import { Iconfont } from "./iconfont";

InitPlugins([new Iconfont(), Setting.Init("iconfont-setting", config)]);
