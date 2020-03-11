import * as Docker from "dockerode";
import { Plugin, ListItem } from "utools-helper";
import { Action } from "utools-helper/@types/utools";
import { platform } from "os";
import { execSync } from "child_process";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Container implements Plugin {
  code = "docker-container";
  docker: Docker;

  async openTerminal(id: string) {
    let cmd = "";
    switch (platform()) {
      case "darwin":
        cmd = `open -a /System/Applications/Utilities/Terminal.app ${utools.getPath(
          "desktop"
        )}`;
        break;
      case "linux":
        cmd = "start cmd.exe";
        break;
      case "win32":
        cmd = "start cmd.exe /K cd";
        break;
    }
    execSync(cmd);
    await sleep(1000);
    utools.robot.setKeyboardDelay(0);
    utools.robot.typeStringDelayed(`docker exec -it ${id} sh`);
    utools.robot.keyTap("enter");
  }

  enter(action: Action) {
    this.docker = new Docker({
      socketPath: "/var/run/docker.sock"
    });
    if (action.payload) return this.search(action.payload);
  }

  async search(word: string): Promise<ListItem[]> {
    let containers = await this.docker.listContainers({
      all: true,
      filters: {
        id: [word]
      }
    });

    if (!containers || containers.length != 1) {
      throw new Error("没有找到对应的容器");
    }

    let container = containers[0];
    let name =
      container.Names.join("-").replace(/^\//, "") + `(${container.Image})`;
    let items: ListItem[];

    if (container.State === "running") {
      items = [
        new ListItem("重启", name, container.Id),
        new ListItem("停止", name, container.Id),
        new ListItem("打开终端", name, container.Id)
      ];
    } else {
      items = [new ListItem("启动", name, container.Id)];
    }
    items.push(new ListItem("删除", name, container.Id));
    return items;
  }

  async select(item: ListItem): Promise<ListItem[]> {
    let container = await this.docker.getContainer(item.data);
    switch (item.title) {
      case "重启":
        await container.restart();
        break;
      case "停止":
        await container.stop();
        break;
      case "启动":
        await container.start();
        break;
      case "删除":
        await container.remove();
        break;
      case "打开终端":
        await this.openTerminal(item.data);
        break;
    }
    utools.showNotification(`${item.title} ${item.description} 成功`);
    utools.hideMainWindow();
    utools.outPlugin();
    return;
  }
}
