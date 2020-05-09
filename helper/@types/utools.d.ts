/// <reference path="electron.d.ts" />

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
  onPluginEnter(cb: (params: onPluginEnterCBParams) => {}): void;

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

  // 窗口交互 API
  /**
   * @description 执行该方法将会隐藏uTools主窗口，包括此时正在主窗口运行的插件，分离的插件不会被隐藏。
   * @param isRestorePreWindow 是否焦点回归到前面的活动窗口，默认 true
   */
  hideMainWindow(isRestorePreWindow?: Boolean): Boolean;

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
   * @param payload
   */
  redirect(cmd: string, payload: string | any): Boolean;

  /**
   * 弹出文件选择框
   * @param options OpenDialogSyncOptions
   */
  showOpenDialog(
    options: Electron.OpenDialogSyncOptions
  ): Array<string> | undefined;

  /**
   * 打开文件保存框
   * @param options SaveDialogSyncOptions
   */
  showSaveDialog(options: Electron.SaveDialogSyncOptions): string | undefined;

  /**
   * 弹出消息框
   */
  showMessageBox(options: Electron.MessageBoxSyncOptions): Number;

  /**
   * 插件页面中查找内容
   * @param text 要搜索的内容(必填):Ubrowser;
   * @param options
   */
  findInPage(text: string, options?: Electron.FindInPageOptions): void;

  /**
   * 停止插件页面中查找
   * @param action "clearSelection" | "keepSelection" | "activateSelection", 默认 "clearSelection"
   */
  stopFindInPage(
    action?: "clearSelection" | "keepSelection" | "activateSelection"
  ): void;

  /**
   * 原生拖拽文件到其他窗口
   * @param file 文件路径 或 文件路径集合
   */
  startDrag(file: string | Array<string>): void;

  /**
   * 创建浏览器窗口
   * @param url  相对路径的html文件 例如: test.html?param=xxx
   * @param options 注意: preload 需配置相对位置
   */
  createBrowserWindow(
    url: string,
    options: Electron.BrowserWindowConstructorOptions
  ): void;

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

  // 工具

  /**
   * 屏幕取色
   * @param cb 取色结束回调
   */
  screenColorPick(cb: (options: screenColorPickCBOptions) => {}): void;

  /**
   * 屏幕截图
   * @param cb 截图结束回调
   */
  screenCapture(cb: (img: string) => {}): void;

  // 模拟

  /**
   * 模拟键盘按键
   * @param key 键值
   * @param modifier 功能键
   */
  simulateKeyboardTap(key: string, ...modifier: string[]): void;

  /**
   * 模拟鼠标移动
   */
  simulateMouseMove(x: Number, y: Number): void;

  /**
   * 模拟鼠标左键单击
   */
  simulateMouseClick(x: Number, y: Number): void;

  /**
   * 模拟鼠标右键单击
   */
  simulateMouseRightClick(x: Number, y: Number): void;

  /**
   * 模拟鼠标双击
   */
  simulateMouseDoubleClick(x: Number, y: Number): void;

  // 屏幕 TODO: 待完善

  // 复制

  /**
   * 复制文件到系统剪贴板
   * @param file
   */
  copyFile(file: string | Array<string>): Boolean;

  /**
   * 复制图片到系统剪贴板
   * @param img
   */
  copyImage(img: string | Buffer): Boolean;

  /**
   * 复制文本
   * @param text
   */
  copyText(text: string): Boolean;

  // 系统
  /**
   * @description 执行该方法将会弹出一个系统通知。
   * @param body 显示的内容
   */
  showNotification(body: string): Boolean;

  /**
   * 系统默认方式打开给定的文件
   * @param path 文件绝对路径
   */
  shellOpenItem(path: string): void;

  /**
   * 系统文件管理器中显示给定的文件
   * @param path 文件绝对路径
   */
  shellShowItemInFolder(path: string): void;

  /**
   * 系统默认的协议打开URL
   * @param url
   */
  shellOpenExternal(url: string): void;

  /**
   * 播放哔哔声
   */
  shellBeep(): void;

  /**
   * @description 获取本地机器唯一ID，可以根据此值区分同一用户的不同设备
   */
  getLocalId(): string;

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
   * @description 获取当前浏览器URL (呼出uTools前的活动窗口):Ubrowser;
   */
  getCurrentBrowserUrl(): string;

  /**
   * 获取当前文件管理器路径(linux 不支持)，呼出uTools前的活动窗口为资源管理器才能获取
   */
  getCurrentFolderPath(): string;

  isMacOs(): void;

  isWindows(): void;

  isLinux(): void;

  /**
   * @description 该方法只适用于在macOS下执行，用于判断uTools是否拥有辅助权限，如果没有可以调用API方法requestPrivilege请求
   */
  isHadPrivilege(): Boolean;

  /**
   * @description  该方法只适用于在macOS下执行，该方法调用后会弹出窗口向用户申请辅助权限。
   */
  requestPrivilege(): Boolean;

  // 数据库 api
  db: DB;

  // ubrowser api
  ubrowser: Ubrowser;

  getIdleUBrowsers(): Array<Object>;
  setUBrowserProxy(config: Object): boolean;
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

export interface screenColorPickCBOptions {
  hex: string;
  rgb: string;
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

export interface Action<T = any> {
  payload: T;
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

interface onPluginEnterCBParams {
  code: string; // plugin.json 配置的 feature.code
  type: string; // plugin.json 配置的 feature.cmd.code
  payload: string; // feature.cmd.type 对应匹配的数据
  optional?: Array<any>; // 存在多个匹配时的可选匹配类型和数据 [{ type, payload }]
}

// ubrowser 相关
/**
 * 请查看 https://u.tools/docs/developer/ubrowser.html
 */
export interface Ubrowser {
  useragent(userAgent: string): Ubrowser;
  goto(url: string, headers?: Object): Ubrowser;
  goto(mdText: string, title?: string): Ubrowser;
  viewport(width: Number, height: Number): Ubrowser;
  hide(): Ubrowser;
  show(): Ubrowser;
  css(cssCode: string): Ubrowser;
  press(key: string, ...modifier: string[]): Ubrowser;
  paste(text?: string): Ubrowser;
  screenshot(arg?: string | Object, savePath?: string): Ubrowser;
  pdf(options?: Object, savePath?: string): Ubrowser;
  device(arg: string | Object): Ubrowser;
  cookies(name?: string): Ubrowser;
  setCookies(name: string, value: string): Ubrowser;
  setCookies(cookies: Array<Object>): Ubrowser;
  removeCookies(name: string): Ubrowser;
  clearCookies(url?: string): Ubrowser;
  devTools(mode?: "right" | "bottom" | "undocked" | "detach"): Ubrowser;
  evaluate(func: Function, ...params: Array<any>): Ubrowser;
  wait(ms: Number): Ubrowser;
  wait(selector: string, timeout?: Number): Ubrowser;
  wait(func: Function, timeout: Number, ...params: Array<any>): Ubrowser;
  when(selector: string): Ubrowser;
  when(func: Function, ...params: Array<any>): Ubrowser;
  end(): Ubrowser;
  click(selector: string): Ubrowser;
  mousedown(selector: string): Ubrowser;
  mouseup(selector: string): Ubrowser;
  file(selector: string, payload: string | Array<string> | Buffer): Ubrowser;
  value(selector: string, val: string): Ubrowser;
  check(selector: string, checked: Boolean): Ubrowser;
  focus(selector: string): Ubrowser;
  scroll(selector: string): Ubrowser;
  scroll(y: Number): Ubrowser;
  scroll(x: Number, y: Number): Ubrowser;
  run(ubrowserId: Number): Promise<Ubrowser>;
  run(options: UbrowserRunOptions): Promise<Ubrowser>;
}

export interface UbrowserRunOptions {
  show: Boolean; //(可选)
  width: Number; //(可选) 宽度
  height: Number; //(可选) 高度
  x: Number; //(可选)
  y: Number; //(可选)
  center: Boolean; //(可选)
  minWidth: Number; //(可选) 窗口的最小宽度, 默认值为
  minHeight: Number; //(可选) 窗口的最小高度. 默认值为
  maxWidth: Number; //(可选) 窗口的最大宽度,
  maxHeight: Number; //(可选) 窗口的最大高度,
  resizable: Boolean; //(可选) 窗口是否可以改变尺寸,
  movable: Boolean; //(可选) 窗口是否可以移动. 在 Linux 中无效。 默认值为
  minimizable: Boolean; //(可选) 窗口是否可以最小化. 在 Linux 中无效。 默认值为
  maximizable: Boolean; //(可选) 窗口是否可以最大化动. 在 Linux 中无效。 默认值为
  alwaysOnTop: Boolean; //(可选) 窗口是否永远置顶。
  fullscreen: Boolean; //(可选) 窗口是否全屏.
  fullscreenable: Boolean; //(可选) 窗口是否可以进入全屏状态，默认值为
  enableLargerThanScreen: Boolean; //(可选) 是否允许改变窗口的大小使之大于屏幕的尺寸. 仅适用于 macOS，因为其它操作系统默认允许 大于屏幕的窗口。 默认值为
  opacity: Number; //(可选) 设置窗口初始的不透明度, 介于 0.0 (完全透明) 和 1.0 (完全不透明) 之间。仅支持 Windows 和
}
