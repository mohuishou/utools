import { Config, IConfigItem } from "./config";

export class TextareaConfig extends Config {
  constructor(config: IConfigItem) {
    super(config);
  }

  render(): string {
    return `
        <textarea autocomplete="off" class="layui-textarea"
        ${this.required ? 'lay-verify="required" required' : ""}
        placeholder="${this.placeholder}"
        name="${this.key}"
        />${this.value}</textarea>
      `;
  }
}
