import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Plugin, IListItem, } from "utools-helper";
import { env, platform } from "process";
import { NewIDE } from "./ide";

export interface Config {
  code?: string;
  icon?: string;
  terminal?: string;
  command?: string;
  database?: string;
  timeout?: string;
  collections?: IListItem[];
  [key: string]: string | IListItem[] | undefined;
}

export function GetVSCodeStoragePath(): string {
  const home = env.USERPROFILE || env.HOME;
  const sharedStorage = home
    ? join(home, ".vscode-shared", "sharedStorage", "state.vscdb")
    : "";

  if (sharedStorage && existsSync(sharedStorage)) {
    return sharedStorage;
  }

  return join(
    utools.getPath("appData"),
    "Code",
    "User",
    "globalStorage",
    "state.vscdb"
  );
}

// 新建配置
export function NewConfig(code: string): Config {
  const shells = {
    "win32": "",
    "darwin": "zsh -l -c",
    "linux": "bash -l -c",
  }

  code = code.toLowerCase()
  const database = code === "vsc" || code === "vscode"
    ? GetVSCodeStoragePath()
    : join(
      utools.getPath("appData"),
      code.charAt(0).toUpperCase() + code.slice(1),
      "User",
      "globalStorage",
      "state.vscdb"
    );

  return {
    code: code,
    icon: "icon/icon.png",
    terminal: shells[platform as keyof typeof shells],
    command: code.toLowerCase(),
    database,
    timeout: "3000"
  }
}

export function GetConfig(code: string): Config {
  let key = utools.getNativeId() + "." + code
  return utools.dbStorage.getItem(key) as Config || {};
}

export function SaveConfig(config: Config, ide: boolean = true) {
  if (ide) {
    NewIDE(config)
    console.log("save feature success")
  }
  let key = utools.getNativeId() + "." + config.code
  utools.dbStorage.setItem(key, config)
}

const SETTING_CONTAINER_ID = "vsc-setting-page";

export function ClearSettingPage() {
  document.getElementById(SETTING_CONTAINER_ID)?.remove();
}

export class Setting implements Plugin {
  code = "vsc-setting"
  config: Config;
  private ideCode: string;

  constructor(code: string) {
    this.ideCode = code;
    this.code = `${code}-setting`;
    this.config = GetConfig(code);
    console.log("init config success: ", this.config)
  }

  enter() {
    utools.setExpendHeight(600);
    this.config = GetConfig(this.ideCode);

    // 渲染设置页面
    this.render()

    // 初始化表单逻辑，未保存的修改不写回当前配置
    this.initForm({ ...this.config });
  }

  private render() {
    ClearSettingPage();

    const html = readFileSync(join(__dirname, "public/setting.html"), "utf8");
    // 使用DOM API添加内容到独立容器内，便于切换功能时清理
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = document.importNode(template.content, true);
    const container = document.createElement('div');
    container.id = SETTING_CONTAINER_ID;
    container.appendChild(fragment);
    document.body.appendChild(container);
  }

  private initForm(config: Config) {
    const form = document.getElementById('settingsForm');
    if (!form) return;

    // 初始化绑定所有字段
    Object.keys(config).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      if (input) {
        input.value = config[key] as any;
        // 添加输入事件监听器，更新config对象
        input.addEventListener('input', (e) => {
          config[key] = (e.target as HTMLInputElement).value;
        });
      }
    });

    // 表单提交处理
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      console.log('表单数据:', config);
      if (!config.icon?.includes("png")) {
        alert("图标格式必须是png")
        return
      }

      SaveConfig(config)
      this.config = config;
      utools.showNotification(`${config.code} 配置已保存`);
      utools.outPlugin(true)
    });
  }
}
