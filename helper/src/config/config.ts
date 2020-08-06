import { InputConfig } from "./inputConfig";
import { Option } from "./selectConfig";

export interface IConfig {
  // 配置项的名字. 存储到DB的key
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label?: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: string;
  // 是否必须
  required?: boolean;

  value: any;
  render(): string;
}

export interface IConfigItem {
  // 配置项的名字. 存储到DB的key
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label?: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: string;
  // 是否必须
  required?: boolean;
  // 可选项
  options?: Option[];

  type: "input" | "select";
}

export abstract class Config implements IConfig {
  // 配置项的名字. 存储到DB的key
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label?: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: string;
  // 是否必须
  required?: boolean;

  get value(): any {
    let data = utools.db.get("config");
    if (data && this.name in data.data) return data.data[this.name];

    // 值不存在，初始化，并且保存
    if (!data) data = { _id: "config", data: {} };
    data.data[this.name] = this.default;
    let res = utools.db.put(data);
    if (!res.ok) throw new Error(res.error);

    return this.default ? this.default : "";
  }

  abstract render(): string;

  constructor(item: IConfigItem) {
    this.name = item.name;
    this.label = item.label ? item.label : this.name;
    this.placeholder = item.placeholder
      ? item.placeholder
      : "请输入" + item.name;
    this.default = item.default;
    this.required = item.required;
  }
}
