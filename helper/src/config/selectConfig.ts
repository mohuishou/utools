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
        <select 
          ${this.required ? 'lay-verify="required" required' : ""}
          placeholder="${this.placeholder}"
          name="${this.key}"
          value="${this.value}"
        >
          ${this.options
            .map(
              (o) =>
                `<option 
                  value="${o.value}"
                  ${this.value === o.value ? "selected" : ""}
                >${o.label ? o.label : o.value}</option>
                `
            )
            .join("\n")}
        </select>
      `;
  }
}
