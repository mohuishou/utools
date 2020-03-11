import * as Docker from "dockerode";
import { Plugin, ListItem } from "utools-helper";

export class ListContainer implements Plugin {
  code = "docker-list-container";
  docker: Docker;

  enter() {
    this.docker = new Docker({
      socketPath: "/var/run/docker.sock"
    });
    return this.search("");
  }

  async search(word: string): Promise<ListItem[]> {
    let containers = await this.docker.listContainers({
      all: true
    });

    // 搜索
    word.split(/\s+/g).forEach(keyword => {
      containers = containers.filter(item => {
        let k = keyword.trim().toLowerCase();
        return (
          item.Names.join("")
            .toLowerCase()
            .includes(k) || item.Image.toLowerCase().includes(k)
        );
      });
    });

    containers = containers.sort((a, b) => {
      if (a.State == "running") return -1;
      return a.Created < b.Created ? 1 : -1;
    });

    return containers.map(item => {
      return new ListItem(
        item.Names.join(",").replace(/^\//, ""),
        item.Image,
        item,
        item.State + ".png"
      );
    });
  }

  select(item: ListItem) {
    let info = item.data as Docker.ContainerInfo;
    utools.redirect("container operate", info.Id);
    return;
  }
}
