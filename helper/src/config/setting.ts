import { Plugin } from "../plugin";
import { IConfig, IConfigItem } from "./config";
import { join } from "path";
import { InputConfig } from "./inputConfig";
import { SelectConfig } from "./selectConfig";
import { TextareaConfig } from "./textareaConfig";

function stopKeyDown(event: any) {
  event.stopPropagation();
}
export class Setting implements Plugin {
  code: string;
  configs: IConfig[] = [];

  private static _instance: Setting;

  static Get(key: string): any {
    let config = utools.db.get("config");
    if (config && key in config.data) return config.data[key];
    for (let i = 0; i < this._instance.configs.length; i++) {
      const conf = this._instance.configs[i];
      if (conf.name === key) return conf.default;
    }
    return;
  }

  static Set(key: string, val: any) {
    let config = utools.db.get("config");
    if (!config) config = { _id: "config", data: {} };
    config.data[key] = val;
    let res = utools.db.put(config);
    if (!res.ok) throw new Error("数据查询失败" + res.error);
  }

  // Init 初始化
  static Init(code: string, configs: IConfigItem[]): Setting {
    if (!this._instance) {
      this._instance = new this(code, configs);
    }
    return this._instance;
  }

  static reset() {
    let setting = document.querySelector("#settings");
    if (setting) setting.remove();
    window.removeEventListener("keydown", stopKeyDown, true);
  }

  private constructor(code: string, configs: IConfigItem[]) {
    this.code = code;
    this.configs = configs.map((item) => {
      return {
        input: (item: IConfigItem) => new InputConfig(item),
        select: (item: IConfigItem) => new SelectConfig(item),
        textarea: (item: IConfigItem) => new TextareaConfig(item),
      }[item.type](item);
    });
  }

  render() {
    let body = document.querySelector("body");
    let layui = join(__dirname, "../layui");
    let settings = document.createElement("div");
    settings.innerHTML = `
      <link rel="stylesheet" href="${layui}/layui.css"  media="all">
      <style>
        #root{
          display: none !important;
        }
        form {
          margin-bottom: 20px;
        }
        #save {
          position: fixed;
          bottom: 0;
          width: 100%;
        }
        footer {
          text-align: center;
          margin-top: 10px;
        }
      </style>
      <form id="config" class="layui-form" action="">
        ${this.configs.map((c) => c.html()).join("\n")}
        <footer> <a href="https://github.com/mohuishou/utools">  power by ⭐ utools-helper  </a> </footer>
        <button id="save" type="submit" class="layui-btn layui-btn-fluid" lay-submit="" lay-filter="config">保存</button>
      </form>
    `;
    settings.setAttribute("id", "settings");

    let layjs = document.createElement("script");
    layjs.type = "text/javascript";
    layjs.src = join(layui, "layui.all.js");
    layjs.id = "layui";
    settings.append(layjs);

    let script = document.createElement("script");
    script.text = `
    document.querySelector("#layui").onload = () => {
      layui.form.on("submit(config)", function (data) {
        window.updateConfig(data.field)
      });
    };
    document.querySelector("a").onclick = (e) => {
      utools.shellOpenExternal(e.target.getAttribute("href"))
    }
    `;

    settings.append(script);

    window.addEventListener("keydown", stopKeyDown, true);
    body.append(settings);
  }

  enter() {
    utools.setExpendHeight(500);
    this.render();
  }
}

// 更新配置
(window as any).updateConfig = (data: any) => {
  let item = utools.db.get("config");
  if (!item) item = { _id: "config", data: data };
  item.data = Object.assign(item.data, data);
  let res = utools.db.put(item);
  if (!res.ok) throw new Error("数据查询失败" + res.error);
  utools.showNotification("配置保存成功");
  utools.outPlugin();
  utools.hideMainWindow();
};
