import { Plugin } from "../plugin";
import { IConfig } from "./config";

export class Setting implements Plugin {
  code: string;
  configs: IConfig[] = [];

  constructor(code: string, configs: IConfig[]) {
    this.code = code;
    this.configs = configs;
  }

  render() {
    let body = document.querySelector("body");
    body.innerHTML = `
      <form id="config">
        ${this.configs.map((c) => c.render()).join("\n")}
        <button id="submit" type="submit">提交</button>
      </form>
    `;

    let script = document.createElement("script");
    script.text = `
      document.querySelector("button").addEventListener("click", function () {
        let form = document.querySelector("form");
        let data = new FormData(form);
        window.updateConfig(data);
      });
    `;
    body.appendChild(script);
  }

  enter() {
    utools.setExpendHeight(300);
    this.render();
  }
}

// 更新配置
(window as any).updateConfig = (data: FormData) => {
  console.log(data);
  for (const c of data) {
    console.log(c);
  }
};
