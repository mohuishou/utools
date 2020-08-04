import { IProcess } from "./process";
import psList = require("ps-list");

export class LinuxProcess implements IProcess {
  async processes(): Promise<psList.ProcessDescriptor[]> {
    return await psList();
  }

  async findIcon(pid: number): Promise<string> {
    return "system.png";
  }
}
