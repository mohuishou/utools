export interface UTools {
  db: DB;
  hideMainWindow(): void;
  outPlugin(): void;
  onPluginReady(cb: Function): void;
  redirect(cmd: string, content: string | any): Boolean;
  showNotification(body: string, code?: string, silent?: Boolean): Boolean;
  setSubInputValue(val: string): Boolean;
}

export interface DB {
  put<T = any>(item: DBItem<T>): DBRes<T>;
  get<T = any>(id: string): DBItem<T>;
  remove<T = any>(id: string | DBItem<T>): DBRes<T>;
  allDocs<T = any>(id?: string | Array<string>): DBRes<T>[];
}

export interface DBItem<T> {
  _id: string;
  _rev?: string;
  data: T;
}

export interface DBRes<T> {
  _id: string;
  ok: boolean;
  data: T;
  _rev?: string;
  error?: any;
}

export interface CallbackListItem {
  title: string;
  description: string;
  icon?: string;
  url?: string;
  [propName: string]: any;
}

declare global {
  var utools: UTools;
}

export interface FeatureArgsAction {}

export interface CallbackSetList {
  (items: CallbackListItem[]): void;
}

export interface FeatureArgsEnter {
  (action: FeatureArgsAction, cb: CallbackSetList): void;
}

export interface FeatureArgsSearch {
  (action: FeatureArgsAction, word: string, cb: CallbackSetList): void;
}

export interface FeatureArgsSelect {
  (
    action: FeatureArgsAction,
    item: CallbackListItem,
    cb: CallbackSetList
  ): void;
}

export interface FeatureArgs {
  enter?: FeatureArgsEnter;
  search?: FeatureArgsSearch;
  select: FeatureArgsSelect;
  placeholder: string;
}

/**
 * @description 模板插件
 */
export interface Feature {
  mode: "list" | "doc" | "none";
  args: FeatureArgs;
}

/**
 * @description 模板插件, feature-code: Featucre
 */
export interface Template {
  [index: string]: Feature;
}
