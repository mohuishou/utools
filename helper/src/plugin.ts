import {
  Action,
  CallbackListItem,
  TplFeature,
  TplFeatureArgs,
  CallbackSetList,
  TemplatePlugin,
  TplFeatureMode,
} from "../@types/utools";

export class ListItem<T = any> implements CallbackListItem {
  title: string;
  description: string;
  data: T;
  icon?: string;
  operate?: string;
  [index: string]: any;

  constructor(
    title: string,
    desc?: string,
    data?: any,
    icon: string = "icon.png"
  ) {
    this.title = title;
    this.description = desc ? desc : title;
    this.data = data ? data : this.description;
    this.icon = icon;
  }

  static error(msg: string) {
    return new ListItem("错误", msg);
  }
}

export interface Plugin {
  code: string;
  mode?: TplFeatureMode;
  placeholder?: string;
  enter?<T = any>(action?: Action): Promise<ListItem<T>[]> | void;
  search?<T = any>(
    word: string,
    action?: Action
  ): Promise<ListItem<T>[]> | void;
  select?<T = any, U = any>(
    item: ListItem<T>,
    action?: Action
  ): Promise<ListItem<U>[]> | void;
}

class Feature implements TplFeature {
  plugin: Plugin;
  mode: TplFeatureMode = "list";
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
          return;
        }
        let items = await this.plugin.select(item, action);
        if (items) return cb(items);
      } catch (error) {
        this.catchError(error, cb);
      }
    },
  };

  catchError(error: Error, cb: CallbackSetList) {
    let errStr = JSON.stringify(error);
    if (cb) {
      cb([
        {
          title: "错误:" + errStr,
          description: errStr,
          icon: ErrorIcon,
        },
      ]);
    } else {
      alert(errStr);
    }
    console.error(error);
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
    plugins.forEach((plugin) => {
      features[plugin.code] = new Feature(plugin);
    });
    window.exports = features;
  } catch (error) {
    alert(error.message + error.stack);
  }
}

const ErrorIcon =
  "data:image/png;base64,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";
