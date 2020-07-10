import { InitPlugins } from "utools-helper";
import { Search } from "./search";
import { Setting } from "./setting";

InitPlugins([new Search(), new Setting()]);
