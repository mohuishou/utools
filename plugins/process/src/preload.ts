import { InitPlugins, Setting } from "utools-helper";
import { IProcess, Process } from "./process";
import { platform } from "process";
import { MacProcess } from "./process_mac";
import { LinuxProcess } from "./process_linux";
import { WinProcess } from "./process_win";
import { config } from "./config";

let process: IProcess;
switch (platform) {
  case "darwin":
    process = new MacProcess();
    break;
  case "linux":
    process = new LinuxProcess();
    break;
  case "win32":
    process = new WinProcess();
    break;
}

InitPlugins([new Process(process), Setting.Init("ps-setting", config)]);
