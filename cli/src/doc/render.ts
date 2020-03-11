import { Index } from ".";
import {
  join,
  basename,
  relative,
  extname,
  dirname,
  parse,
  ParsedPath
} from "path";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  stat,
  statSync
} from "fs";
import { renderFile } from "ejs";
import { Path } from "./path";

const anchor = require("markdown-it-anchor");
const prism = require("markdown-it-prism");
let md = require("markdown-it")({
  html: true
});
md = md.use(anchor).use(prism, {
  defaultLanguage: "bash"
});

export class Render {
  input: string;
  code: string;
  output: string;
  indexes: Index[] = [];
  preloadPath: string;
  assetsPath: string;
  path: Path;

  constructor(input: string, code: string, output: string) {
    this.input = input;
    this.code = code;
    this.output = join(output, this.code);
    this.preloadPath = output;
    this.assetsPath = join(output, "assets");
    this.indexes = [];
    this.path = new Path(output);
  }

  async render() {
    mkdirSync(this.output, { recursive: true });
    this.renderReadme();
    this.renderDir(this.input);
  }

  async renderDir(dir: string) {
    let paths = readdirSync(dir);
    for (let i = 0; i < paths.length; i++) {
      let p = join(dir, paths[i]);
      // 判断是否是文件夹
      if (statSync(p).isDirectory()) {
        mkdirSync(join(this.output, relative(this.input, p)), {
          recursive: true
        });
        await this.renderDir(p);
        continue;
      }
      if (extname(p).toLowerCase() !== ".md") {
        console.log(p, "is not markdown file skip");
        continue;
      }
      await this.renderMarkdown(p);
    }
    writeFileSync(
      join(this.output, "indexes.json"),
      JSON.stringify(this.indexes)
    );
  }

  async renderReadme() {
    let path = this.path.readme;
    let file = readFileSync(path).toString();
    let filename = basename(path, extname(path));
    let outFilename = "00_" + filename + ".html";
    let outPath = join(this.output, outFilename);
    writeFileSync(
      outPath,
      await renderFile(join(__dirname, "template", "doc.html.ejs"), {
        markdown: md.render(file),
        assets: relative(dirname(outPath), this.assetsPath)
      })
    );
    this.indexes.push({
      t: filename,
      d: "from " + filename,
      p: this.path.relate(outPath)
    });
  }

  async renderMarkdown(path: string) {
    let file = readFileSync(path).toString();
    let filename = basename(path, extname(path));
    let outFilename = filename + ".html";
    let outPath = join(
      this.output,
      relative(this.input, dirname(path)),
      outFilename
    );
    writeFileSync(
      outPath,
      await renderFile(this.path.tplDoc, {
        markdown: md.render(file),
        assets: relative(dirname(outPath), this.assetsPath)
      })
    );

    let relativeFile = this.path.relate(outPath);
    this.indexes.push({
      t: filename,
      d: "from " + filename,
      p: relativeFile
    });
    this.headerIndexes(file, relativeFile);
  }

  headerIndexes(file: string, relativePreloadFile: string) {
    let r = new RegExp(/#+\s+(.*)\n+(.*)/g);
    let header: RegExpExecArray | null;
    while ((header = r.exec(file)) !== null) {
      let anchor = encodeURIComponent(
        header[1].toLowerCase().replace(/\s+/g, "-")
      );
      this.indexes.push({
        t: header[1],
        d: header[2],
        p: relativePreloadFile + `#${anchor}`
      });
    }
  }
}
