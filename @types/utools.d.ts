/**
 * @description 文档链接: https://u.tools/docs/developer/api.html
 */
export interface UTools {
  // 事件相关API
  /**
   * @description 当插件装载成功，uTools将会主动调用这个方法（生命周期内仅调用一次）
   * @description 注意：uTools 的其他api以及preload.js中定义的方法，都需要在此回调被执行后才可被调用，否则将报错。
   * @param cb 回调函数
   */
  onPluginReady(cb: Function): void;
  /**
   * @description 每当插件从后台进入到前台时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onPluginEnter(cb: Function): void;
  /**
   * @description 每当插件从前台进入到后台时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onPluginOut(cb: Function): void;
  /**
   * @description 用户对插件进行分离操作时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onPluginDetach(cb: Function): void;
  /**
   * @description 当此插件的数据在其他设备上被更改后同步到此设备时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onDbPull(cb: Function): void;

  // 数据库 api
  db: DB;

  // 窗口交互 API
  /**
   * @description 执行该方法将会隐藏uTools主窗口，包括此时正在主窗口运行的插件，分离的插件不会被隐藏。
   */
  hideMainWindow(): Boolean;
  /**
   * @description 执行该方法将会显示uTools主窗口，包括此时正在主窗口运行的插件。
   */
  showMainWindow(): Boolean;
  /**
   * 执行该方法将会修改插件窗口的高度。
   * @param height 窗口的高度
   */
  setExpendHeight(height: Number): Boolean;
  /**
   * @description 设置子输入框，进入插件后，原本uTools的搜索条主输入框将会变成子输入框，子输入框可以为插件所使用。
   * @param onChange 回调函数
   * @param placeholder 自输入框提示
   * @param isFocus 是否聚焦
   */
  setSubInput(
    onChange: onSubInputChange,
    placeholder?: string,
    isFocus?: Boolean
  ): Boolean;
  /**
   * @description 移出先前设置的子输入框，在插件切换到其他页面时可以重新设置子输入框为其所用。
   */
  removeSubInput(): Boolean;
  /**
   * @description 直接对子输入框的值进行设置。
   * @param val 需要输入的值
   */
  setSubInputValue(val: string): Boolean;
  /**
   * @description 子输入框获得焦点
   */
  subInputFocus(): Boolean;
  /**
   * @description 子输入框获得焦点并选中
   */
  subInputSelect(): Boolean;
  /**
   * @description 子输入框失去焦点，插件获得焦点
   */
  subInputBlur(): Boolean;
  /**
   * @description 执行该方法将会退出当前插件。
   */
  outPlugin(): Boolean;
  /**
   * 该方法可以携带数据，跳转到另一个插件进行处理，如果用户未安装对应的插件，uTools会弹出提醒并引导进入插件中心下载。
   * @param cmd 插件关键词
   * @param content
   */
  redirect(cmd: string, content: string | any): Boolean;

  // 动态增减

  // 其他
  showNotification(body: string, code?: string, silent?: Boolean): Boolean;
}

export interface onSubInputChangeArg {
  text: string;
}

export interface onSubInputChange {
  (item: onSubInputChangeArg): void;
}

export interface DB {
  /**
   * @description 执行该方法将会创建或更新数据库文档
   * @description 每次更新时都要传入完整的文档数据，无法对单个字段进行更新
   * @param item 数据
   */
  put<T = any>(item: DBItem<T>): DBRes<T>;
  /**
   * @description 执行该方法将会根据文档ID获取数据
   * @param id doc id
   */
  get<T = any>(id: string): DBItem<T>;
  /**
   * @description 执行该方法将会删除数据库文档，可以传入文档对象或文档id进行操作。
   * @param id id 或者是完整的文档
   */
  remove<T = any>(id: string | DBItem<T>): DBRes<T>;
  /**
   * @description 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
   * @param items 数据
   */
  bulkDocs<T = any>(items: DBItem<T>[]): DBRes<T>[];
  /**
   * @description 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定ID的数组，不传入则为获取所有文档。
   * @param id id 或 id 数组
   */
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

export interface FeatureArgsAction {
  payload: string;
  code: string;
  type: string;
}

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
export interface TemplatePlugin {
  [index: string]: Feature;
}
