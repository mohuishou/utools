import { Plugin, ListItem } from "utools-helper";

export class Setting implements Plugin {
  code = "docker-setting";
  socketPath = "";
  terminalCmd = "";

  enter() {}

  search(word: string) {}

  select(item: ListItem) {}
}
