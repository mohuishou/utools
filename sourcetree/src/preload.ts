import { InitPlugins } from "utools-helper";
import { SourceTree } from "./sourcetree";
import { platform } from "os";
import { BookMarksMac } from "./bookmarks_mac";

let st = new SourceTree(new BookMarksMac());
// todo: support windows
if (platform() === "win32") {
}

InitPlugins([st]);
