import { Plugin } from "./plugin";
import { join, dirname } from "path";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync
} from "fs";
import { Feature } from "./feature";
import { renderFile } from "ejs";
import { cwd } from "process";
import { Render } from "./render";

export class Generate {
  plugin: Plugin;
  output: string;
  pluginPath: string;

  constructor(pluginPath: string, output: string) {
    this.pluginPath = pluginPath;
    let plugin = JSON.parse(readFileSync(pluginPath).toString());
    this.plugin = plugin;
    this.output = join(cwd(), output);
  }

  async gen() {
    mkdirSync(this.output, { recursive: true });
    await this.copyAssets();
    await this.preload();
    await this.plugin.features.forEach(async f => {
      f.input = join(cwd(), dirname(this.pluginPath), f.input);
      await this.docs(f);
    });
  }

  // 验证
  private validate() {}

  // 生成 readme 文档
  private readme() {}

  // 生成 preload.js
  private async preload() {
    writeFileSync(
      join(this.output, "preload.js"),
      await renderFile(join(__dirname, "template", "preload.js.ejs"), {
        features: this.plugin.features
      })
    );
  }

  private copyAssets() {
    let assetsPath = join(__dirname, "assets");
    let paths = readdirSync(assetsPath);
    mkdirSync(join(this.output, "assets"), { recursive: true });
    paths.forEach(p => {
      copyFileSync(join(assetsPath, p), join(this.output, "assets", p));
    });
  }

  // 生成 文档
  private async docs(feature: Feature) {
    await new Render(feature.input, feature.code, this.output).render();
  }
}
