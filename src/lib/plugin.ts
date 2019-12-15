import {
  Action,
  CallbackListItem,
  TplFeature,
  TplFeatureArgs,
  CallbackSetList
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

export interface TemplatePlugin {
  code: string;
  mode?: "doc" | "list" | "none";
  placeholder?: string;
  enter?<T>(action: Action): Promise<ListItem<T>[]>;
  search?<T>(action: Action, word: string): Promise<ListItem<T>[]>;
  select<T>(action: Action, item: ListItem<T>): Promise<ListItem<T>[]>;
}

class Feature implements TplFeature {
  plugin: TemplatePlugin;
  mode: "list" | "doc" | "none" = "list";
  args: TplFeatureArgs = {
    placeholder: "请输入关键词",
    enter: async (action, cb) => {
      try {
        if (this.plugin.enter) {
          cb(await this.plugin.enter(action));
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
        cb(await this.plugin.search(action, word));
      } catch (error) {
        this.catchError(error, cb);
      }
    },
    select: async (action, item: ListItem, cb) => {
      try {
        cb(await this.plugin.select(action, item));
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

  constructor(plugin: TemplatePlugin) {
    this.plugin = plugin;
    if (plugin.mode) this.mode = plugin.mode;
    if (plugin.placeholder) this.args.placeholder = plugin.placeholder;
  }
}

export function InitPlugins(plugins: TemplatePlugin[]) {
  let features = {};
  plugins.forEach(plugin => {
    features[plugin.code] = new Feature(plugin);
  });
  window.exports = features;
}
