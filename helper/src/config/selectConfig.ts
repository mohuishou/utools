import { Config, IConfigItem } from "./config";

export interface Option {
  label?: string;
  value: string;
}

export class SelectConfig extends Config {
  options: Option[];

  constructor(config: IConfigItem) {
    super(config);

    this.options = config.options;
  }

  render(): string {
    return `
    <div class="layui-form-item">
      <label class="layui-form-label">${this.label}</label>
      <div class="layui-input-block">
        <select 
          ${this.required ? "required" : ""}
          placeholder="${this.placeholder}"
          lay-verify="required"
          name="${this.name}"
          value="${this.value}"
        >
          ${this.options
            .map(
              (o) =>
                `<option 
                  value="${o.value}"
                  ${this.value === o.value ? "selected" : ""}
                >
                ${o.label ? o.label : o.value}
                </option>
                `
            )
            .join("\n")}
        </select>
      </div>
    </div>`;
  }
}
