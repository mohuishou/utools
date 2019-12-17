import {
  Action,
  CallbackListItem,
  TplFeature,
  TplFeatureArgs,
  CallbackSetList,
  TemplatePlugin
} from "../../@types/utools";

export class ListItem<T = any> implements CallbackListItem {
  title: string;
  description: string;
  data: T;
  icon?: string;

  constructor(title: string, data?: any) {
    this.title = title;
    this.description = title;
    this.icon = "icon.png";
    this.data = data;
  }

  static error(msg: string) {
    let item = new ListItem("错误");
    item.description = msg;
    return item;
  }
}

export interface Plugin {
  code: string;
  mode?: "doc" | "list" | "none";
  placeholder?: string;
  enter?<T = any>(action?: Action): Promise<ListItem<T>[]> | void;
  search?<T = any>(word: string, action?: Action): Promise<ListItem<T>[]> | void;
  select<T = any, U = any>(item: ListItem<T>, action?: Action): Promise<ListItem<U>[]> | void;
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
  let features: TemplatePlugin = {};
  plugins.forEach(plugin => {
    features[plugin.code] = new Feature(plugin);
  });
  window.exports = features;
}
