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
  /**
   * @description 返回本插件所有动态增加的功能。
   */
  getFeatures(): Feature[];

  /**
   * @description 为本插件动态新增某个功能。
   * @param feature feature
   */
  setFeature(feature: Feature): Boolean;

  /**
   * @description 动态删除本插件的某个功能。
   * @param code feature.code
   */
  removeFeature(code: string): Boolean;

  // 其他
  /**
   * @description 执行该方法将会弹出一个系统通知。
   * @param body 显示的内容
   * @param code 用户点击系统通知时，uTools将会使用此`code`进入插件
   * @param silent 是否播放声音
   */
  showNotification(body: string, code?: string, silent?: Boolean): Boolean;

  /**
   * @description 该方法只适用于在macOS下执行，用于判断uTools是否拥有辅助权限，如果没有可以调用API方法requestPrivilege请求
   */
  isHadPrivilege(): Boolean;

  /**
   * @description  该方法只适用于在macOS下执行，该方法调用后会弹出窗口向用户申请辅助权限。
   */
  requestPrivilege(): Boolean;

  /**
   * @description 你可以通过名称请求以下的路径
   * home 用户的 home 文件夹（主目录）
   * appData 当前用户的应用数据文件夹，默认对应：
   *   %APPDATA% Windows 中
   *   ~/Library/Application Support macOS 中
   * userData 储存你应用程序设置文件的文件夹，默认是 appData 文件夹附加应用的名称
   * temp 临时文件夹
   * exe 当前的可执行文件
   * desktop 当前用户的桌面文件夹
   * documents 用户文档目录的路径
   * downloads 用户下载目录的路径
   * music 用户音乐目录的路径
   * pictures 用户图片目录的路径
   * videos 用户视频目录的路径
   * logs 应用程序的日志文件夹
   * @param name
   */
  getPath(name: PathName): string;
  /**
   * @description 复制文件或文件夹到剪贴板
   * @param paths
   */
  copyFile(paths: string | Array<string>): Boolean;
  /**
   * @description 复制图片到剪贴板
   * @param buffer
   */
  copyImage(buffer: ArrayBuffer): Boolean;
  /**
   * @description 屏幕取色
   * @param cb
   */
  screenColorPick(cb: Function): void;
  /**
   * @description 获取当前浏览器URL (呼出uTools前的活动窗口)
   */
  getCurrentBrowserUrl(): string;
  /**
   * @description 获取本地机器唯一ID，可以根据此值区分同一用户的不同设备
   */
  getLocalId(): string;
}

export type PathName =
  | "home"
  | "appData"
  | "userData"
  | "temp"
  | "exe"
  | "desktop"
  | "documents"
  | "downloads"
  | "music"
  | "pictures"
  | "videos"
  | "logs";

export interface Feature {
  code: string;
  explain: string;
  icon?: string;
  platform?: Array<string>;
  cmds: Array<any>;
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

export interface Action {
  payload: string;
  code: string;
  type: string;
}

declare global {
  let utools: UTools;
}

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
 * @description 子输入框内容变化时被调用 可选 (未设置则无搜索)
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

/**
 * @description 模板插件 Feature
 */
export interface TplFeature {
  mode: "list" | "doc" | "none";
  args: TplFeatureArgs;
}

/**
 * @description 模板插件, feature-code: Feature
 */
export interface TemplatePlugin {
  [index: string]: TplFeature;
}
