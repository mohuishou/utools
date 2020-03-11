import { Command, flags } from "@oclif/command";
import { readFileSync } from "fs";
import { Generate } from "../doc/generate";
import { Plugin } from "../doc/plugin";

export default class Doc extends Command {
  static description = "文档生成器，将markdown等文档，自动转化为utools文档插件";

  static examples = [`$ utools doc -p plugin.json public`];

  static flags = {
    help: flags.help({ char: "h" }),
    plugin: flags.string({ char: "p", description: "plugin.json path" })
  };

  static args = [{ name: "output" }];

  async run() {
    const { args, flags } = this.parse(Doc);
    if (!flags.plugin) {
      this.error("miss -p, plugin.json path is must");
    }

    let gen = new Generate(flags.plugin, args["output"]);
    await gen.gen();
  }
}
