import { Plugin } from "../plugin";
import { IConfig, IConfigItem } from "./config";
import { join } from "path";
import { InputConfig } from "./inputConfig";
import { SelectConfig } from "./selectConfig";

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

  // Init 初始化
  static Init(code: string, configs: IConfigItem[]): Setting {
    if (this._instance) return this._instance;
    return new this(code, configs);
  }

  static reset() {
    let setting = document.querySelector("#settings");
    if (setting) setting.remove();
  }

  private constructor(code: string, configs: IConfigItem[]) {
    this.code = code;
    this.configs = configs.map((item) => {
      return {
        input: (item: IConfigItem) => new InputConfig(item),
        select: (item: IConfigItem) => new SelectConfig(item),
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
      </style>
      <form id="config" class="layui-form" action="">
        ${this.configs.map((c) => c.render()).join("\n")}
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
    }
    `;
    settings.append(script);

    body.insertBefore(settings, document.querySelector("#root"));
  }

  enter() {
    utools.setExpendHeight(300);
    this.render();
  }
}

// 更新配置
(window as any).updateConfig = (data: any) => {
  let item = utools.db.get("config");
  if (!item) item = { _id: "config", data: data };
  item.data = data;
  let res = utools.db.put(item);
  if (!res.ok) throw new Error("数据查询失败" + res.error);
  utools.showNotification("配置保存成功");
  utools.outPlugin();
  utools.hideMainWindow();
};
