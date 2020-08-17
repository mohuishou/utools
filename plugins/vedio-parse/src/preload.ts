import { InitPlugins, Setting } from "utools-helper";
import { Vedio } from "./vedio";
import { configs } from "./config";

InitPlugins([new Vedio(), Setting.Init("vedio-setting", configs)]);
