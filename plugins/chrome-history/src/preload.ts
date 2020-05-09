import { InitPlugins } from "utools-helper";
import { ChromeHistory } from "./chrome_history";
import { Setting } from "./setting";

InitPlugins([new ChromeHistory(), new Setting()]);
