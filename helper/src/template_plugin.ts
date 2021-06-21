export interface CallbackListItem {
  title: string;
  description: string;
  icon?: string;
  url?: string;

  [propName: string]: any;
}

/**
 * @description 设置列表项目
 * @param items 设置条目
 */
export interface CallbackSetList {
  (items: CallbackListItem | CallbackListItem[]): void;
}

/**
 * @param action action
 * @param cb 回调函数，可以继续设置列表项目
 * @description 进入插件时调用（可选）
 */
export interface TplFeatureArgsEnter {
  (action: Action, cb: CallbackSetList): void;
}

/**
 * @param action action
 * @param word 搜索的字符创
 * @param cb 回调函数，可以继续设置列表项目
 * @description 子输入框内容变化时被调用 可选 (未设置则无搜索):Ubrowser;
 */
export interface TplFeatureArgsSearch {
  (action: Action, word: string, cb: CallbackSetList): void;
}

/**
 * @param action action
 * @param item 选中的item
 * @param cb 回调函数，可以继续设置列表项目
 * @description 用户选择列表中某个条目时被调用
 */
export interface TplFeatureArgsSelect {
  (action: Action, item: CallbackListItem, cb: CallbackSetList): void;
}

/**
 * @description 模板插件参数
 */
export interface TplFeatureArgs {
  enter?: TplFeatureArgsEnter;
  search?: TplFeatureArgsSearch;
  select: TplFeatureArgsSelect;
  placeholder: string;
}

export type TplFeatureMode = "list" | "doc" | "none";

/**
 * @description 模板插件 Feature
 */
export interface TplFeature {
  mode: TplFeatureMode;
  args: TplFeatureArgs;
}

/**
 * @description 模板插件, feature-code: Feature
 */
export interface TemplatePlugin {
  [index: string]: TplFeature;
}

export interface Action<T = any> {
  payload: T;
  code: string;
  type: string;
}
