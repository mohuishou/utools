import { IConfig } from "./config";

export class InputConfig implements IConfig {
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  label: string;
  // 配置项说明
  placeholder?: string;
  // 配置项默认值
  default?: string;
  // 是否必须
  required?: boolean;
  // 配置校验
  validate?: RegExp;

  get value(): string {
    return "";
  }

  render(): string {
    return `
    <div class="field ${this.name}">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="text" 
          ${this.required ? "required" : ""}
          placeholder="${this.placeholder}"
          name="${this.name}"
          value="${this.value}"
        />
      </div>
    </div>`;
  }
}
