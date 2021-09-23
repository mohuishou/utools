import { InitPlugins, Setting } from "utools-helper";
import { Search } from "./search";
import { configs } from "./config";


try {
    InitPlugins([new Search(), Setting.Init("yuque-setting", configs)]);
} catch (error) {
    alert(error)
}