import { Plugin, IListItem, ListItem } from "utools-helper";
import psList = require("ps-list");
const fileIcon = require("file-icon");

export class Process implements Plugin {
  code = "ps";

  async enter(): Promise<IListItem[]> {
    return this.search("");
  }

  async search(word: string): Promise<IListItem[]> {
    let processes = await psList();
    processes = processes.sort((a, b) => -a.cpu + b.cpu);

    let words = word.toLowerCase().split(/\s+/g);
    words.forEach((w) => {
      processes = processes.filter((p) => p.name.toLowerCase().includes(w));
    });

    processes = processes.slice(1, 20);

    return await Promise.all(
      processes.map(
        async (p): Promise<IListItem> => {
          let icon;
          try {
            let id = p.ppid === 1 ? p.pid : p.ppid;
            icon =
              "data:image/png;base64," +
              Buffer.from(await fileIcon.buffer(id)).toString("base64");
          } catch (error) {
            console.log(error);
            icon = "system.png";
          }
          return {
            title: p.name,
            description: `cpu: ${p.cpu}%, mem: ${p.memory}%, cmd: ${p.cmd}`,
            icon: icon,
            data: p,
          };
        }
      )
    );
  }

  select(item: IListItem) {
    process.kill(item.data.pid);
  }
}
