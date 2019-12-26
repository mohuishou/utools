import {
  Action,
  CallbackListItem,
  TplFeature,
  TplFeatureArgs,
  CallbackSetList,
  TemplatePlugin
} from "../@types/utools";
import { shell, clipboard } from "electron";
import { execSync } from "child_process";

type operateType = "url" | "items" | "shell" | "copy";
let operates = new Map<operateType, any>();
operates.set("url", shell.openExternal);
operates.set("shell", execSync);
operates.set("copy", clipboard.writeText);

export class ListItem<T = any> implements CallbackListItem {
  title: string;
  description: string;
  data: T;
  icon?: string;
  operate: operateType = "url";
  [index: string]: any;

  constructor(title: string, data?: any, desc?: string, icon: string = "icon.png") {
    this.title = title;
    this.description = desc;
    this.icon = icon;
    this.data = data;

    if (!desc) this.description = title;
  }

  static error(msg: string) {
    return new ListItem("错误", "", msg);
  }
}

export interface Plugin {
  code: string;
  mode?: "doc" | "list" | "none";
  placeholder?: string;
  enter?<T = any>(action?: Action): Promise<ListItem<T>[]> | void;
  search?<T = any>(word: string, action?: Action): Promise<ListItem<T>[]> | void;
  select?<T = any, U = any>(item: ListItem<T>, action?: Action): Promise<ListItem<U>[]> | void;
}

class Feature implements TplFeature {
  plugin: Plugin;
  mode: "list" | "doc" | "none" = "list";
  args: TplFeatureArgs = {
    placeholder: "请输入关键词",
    enter: async (action, cb) => {
      try {
        if (this.plugin.enter) {
          let items = await this.plugin.enter(action);
          if (items) cb(items);
          return;
        }

        if (this.mode != "none") {
          this.args.search(action, "", cb);
        }
      } catch (error) {
        this.catchError(error, cb);
      }
    },
    search: async (action, word, cb) => {
      try {
        if (!this.plugin.search) {
          return;
        }
        let items = await this.plugin.search(word, action);
        if (items) cb(items);
      } catch (error) {
        this.catchError(error, cb);
      }
    },
    select: async (action, item: ListItem, cb) => {
      try {
        if (!this.plugin.select) {
          if (item.operate == "items") {
            return cb(item.data);
          }
          return operates.get(item.operate)[item.data];
        }
        let items = await this.plugin.select(item, action);
        if (items) return cb(items);
      } catch (error) {
        this.catchError(error, cb);
      }
    }
  };

  catchError(error: Error, cb: CallbackSetList) {
    console.error(error);
    cb({
      title: "错误:" + error.message,
      description: error.message + error.stack
    });
  }

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    if (plugin.mode) this.mode = plugin.mode;
    if (plugin.placeholder) this.args.placeholder = plugin.placeholder;
  }
}

export function InitPlugins(plugins: Plugin[]) {
  try {
    let features: TemplatePlugin = {};
    plugins.forEach(plugin => {
      features[plugin.code] = new Feature(plugin);
    });
    window.exports = features;
  } catch (error) {
    alert(error.message + error.stack);
  }
}
