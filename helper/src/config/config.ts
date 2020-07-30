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
  // 配置校验
  validate?: RegExp;

  value: string;
  render(): string;
}
