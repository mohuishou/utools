import {
  Action,
  TplFeature,
  TplFeatureArgs,
  CallbackSetList,
  TemplatePlugin,
  TplFeatureMode,
} from "./template_plugin";

import { IListItem } from "./listItem";
import { ErrorIcon } from "./icon";
import { Setting } from "./config";
import { debounce } from "throttle-debounce";

export interface Plugin {
  code: string;
  mode?: TplFeatureMode;
  placeholder?: string;

  /**
   * 节流延迟，默认 500ms，单位 ms
   */
  delay?: number;

  /**
   * 是否在 select 结束之后退出插件
   */
  outPlugin?: boolean;

  /**
   * 是否在 select 结束之后隐藏插件
   */
  hideMainWindow?: boolean;

  enter?(
    action?: Action
  ): IListItem | Promise<IListItem> | IListItem[] | Promise<IListItem[]> | void;

  search?(
    word: string,
    action?: Action
  ): IListItem | Promise<IListItem> | IListItem[] | Promise<IListItem[]> | void;

  select?(
    item: IListItem,
    action?: Action
  ): IListItem | Promise<IListItem> | IListItem[] | Promise<IListItem[]> | void;
}

class Feature implements TplFeature {
  plugin: Plugin;
  mode: TplFeatureMode = "list";
  delay: number = 500;
  search: any;

  args: TplFeatureArgs = {
    placeholder: "请输入关键词查询",

    enter: async (action, cb) => {
      try {
        Setting.reset();
        if (this.plugin.enter) {
          let items = await this.plugin.enter(action);
          if (items) cb(items);
          return;
        }
        if (this.mode != "none") this.args.search(action, "", cb);
      } catch (error) {
        this.catchError(error, cb);
      }
    },

    search: async (action, word, cb) => {
      try {
        if (!this.plugin.search) return;
        await this.search(word, action, cb);
        if (this.plugin.outPlugin) utools.outPlugin();
        if (this.plugin.hideMainWindow) utools.hideMainWindow();
      } catch (error) {
        this.catchError(error, cb);
      }
    },

    select: async (action, item: IListItem, cb) => {
      try {
        if (!this.plugin.select) return;
        let items = await this.plugin.select(item, action);
        if (items) return cb(items);
        if (this.plugin.outPlugin) utools.outPlugin();
        if (this.plugin.hideMainWindow) utools.hideMainWindow();
      } catch (error) {
        this.catchError(error, cb);
      }
    },
  };

  catchError(error: Error, cb: CallbackSetList) {
    let errStr = error.message ? String(error) : JSON.stringify(error);
    try {
      cb([
        {
          title: errStr,
          description: errStr,
          icon: ErrorIcon,
        },
      ]);
    } catch (error) {
      alert(errStr);
    }
    console.error(error);
  }

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    if (plugin.mode) this.mode = plugin.mode;
    if (plugin.placeholder) this.args.placeholder = plugin.placeholder;
    if (plugin.delay) this.delay = plugin.delay;
    this.search = debounce(
      this.delay,
      false,
      async (word: string, action: Action, cb: CallbackSetList) => {
        let items = await this.plugin.search(word, action);
        if (items) return cb(items);
      }
    );
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
    alert(error.stack ? error.stack : error);
  }
}
