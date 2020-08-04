import { IProcess } from "./process";
import psList = require("ps-list");
import { execSync } from "child_process";

export class WinProcess implements IProcess {
  async processes(): Promise<psList.ProcessDescriptor[]> {
    let res = execSync("get-process -AutoSize", { shell: "powershell.exe" });
    let s = res.toString();
    console.log(s.split(/\t/g));
    return;
  }

  async findIcon(pid: number): Promise<string> {
    return "system.png";
  }
}
