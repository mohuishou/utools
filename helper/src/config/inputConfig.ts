import { Config, IConfigItem } from "./config";

export class InputConfig extends Config {
  constructor(config: IConfigItem) {
    super(config);
  }

  render(): string {
    return `
    <div class="layui-form-item">
      <label class="layui-form-label">${this.label}</label>
      <div class="layui-input-block">
        <input type="text" autocomplete="off" class="layui-input"
        ${this.required ? "required" : ""}
        placeholder="${this.placeholder}"
        lay-verify="required"
        name="${this.name}"
        value="${this.value}"
        />
      </div>
    </div>`;
  }
}
