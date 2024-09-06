import { Option } from "./selectConfig";

export interface IConfig {
  // 配置项的名字. 存储到DB的key
  name: string;
  key: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label?: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: any;
  // 是否必须
  required?: boolean;
  // 输入提示项，展示在输入框下面
  tips?: string;

  value: any;
  render(): string;
  html(): string;
}

export interface IConfigItem {
  // 配置项的名字. 存储到DB的key
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label?: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: any;
  // 是否必须
  required?: boolean;
  // 可选项
  options?: Option[];
  // 输入提示项，展示在输入框下面
  tips?: string;
  // 每个机器上都保持不同配置
  only_current_machine?: boolean;

  type: "input" | "select" | "textarea";
}

export abstract class Config implements IConfig {
  // 配置项的名字
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label?: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: any;
  // 是否必须
  required?: boolean;
  // 输入提示项，展示在输入框下面
  tips?: string;
  // 每个机器上都保持不同配置
  only_current_machine?: boolean;

  get key(): string {
    if (this.only_current_machine) {
      return utools.getNativeId() + "." + this.name;
    }
    return this.name;
  }

  get value(): any {
    let itemOld = utools.db.get("config");
    let data = itemOld as { _id: string; _rev?: string; data: any };
    if (data && this.key in data.data) return data.data[this.key];

    // 值不存在，初始化，并且保存
    if (!data) data = { _id: "config", data: {} };
    data.data[this.key] = this.default;
    let res = utools.db.put(data);
    if (!res.ok) throw new Error(res.message);

    return this.default ? this.default : "";
  }

  abstract render(): string;

  html(): string {
    let tips = this.tips
      ? '<div class="layui-form-mid layui-word-aux">' + this.tips + "</div>"
      : "";
    return `
    <div class="layui-form-item">
      <label class="layui-form-label">${this.label}</label>
      <div class="layui-input-block">
        ${this.render()}
        ${tips ? tips : ""}
      </div>
    </div>
    `;
  }

  constructor(item: IConfigItem) {
    this.name = item.name;
    this.only_current_machine = item.only_current_machine;
    this.label = item.label ? item.label : item.name;
    this.placeholder = item.placeholder
      ? item.placeholder
      : "请输入" + item.name;
    this.default = item.default;
    this.required = item.required;
    this.tips = item.tips;
  }
}
