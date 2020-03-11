import { join, relative } from "path";

export class Path {
  output: string;

  constructor(output: string) {
    this.output = output;
  }

  get readme() {
    return join(this.output, "README.md");
  }

  get preload() {
    return join(this.output, "preload.js");
  }

  get tplDoc() {
    return join(__dirname, "template", "doc.html.ejs");
  }

  get tplReadme() {
    return join(__dirname, "template", "README.md.ejs");
  }

  get tplPreload() {
    return join(__dirname, "template", "preload.js.ejs");
  }

  /**
   * 以 output 为起点，获取相对路径
   * @param to 目的路径
   */
  relate(to: string) {
    return relative(this.output, to);
  }
}
