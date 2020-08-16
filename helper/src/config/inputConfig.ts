import { Config, IConfigItem } from "./config";

export class InputConfig extends Config {
  constructor(config: IConfigItem) {
    super(config);
  }

  render(): string {
    return `
        <input type="text" autocomplete="off" class="layui-input"
        ${this.required ? 'lay-verify="required" required' : ""}
        placeholder="${this.placeholder}"
        name="${this.name}"
        value="${this.value}"
        />
      `;
  }
}
