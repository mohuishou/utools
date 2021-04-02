import { join } from "path";
import { platform } from "process";
import { IConfigItem } from "utools-helper";

let defaultShell = "bash -l -c";
switch (platform) {
  case "win32":
    defaultShell = "";
    break;
  case "darwin":
    defaultShell = "zsh -l -c";
    break;
}

export const config: IConfigItem[] = [
  {
    name: "shell",
    label: "shell",
    type: "input",
    required: false,
    placeholder: "一般情况下无需修改，windows 请保持为空值",
    default: defaultShell,
  },
  {
    name: "code",
    label: "code",
    type: "input",
    placeholder: "vscode 命令",
    required: true,
    default: "code",
  },
  {
    name: "storage",
    label: "storage",
    type: "input",
    required: true,
    default: join(utools.getPath("appData"), "Code", "storage.json"),
  },
];
