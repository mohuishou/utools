import { InitPlugins, Setting } from "utools-helper";
import { Search } from "./search";
import { configs } from "./config";

InitPlugins([new Search(), Setting.Init("yuque-setting", configs)]);
