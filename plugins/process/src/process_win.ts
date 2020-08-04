import { IProcess } from "./process";
import psList = require("ps-list");
import { execSync } from "child_process";
import { getSystemMemoryInfo } from "process";

export class WinProcess implements IProcess {
  async processes(): Promise<psList.ProcessDescriptor[]> {
    let res = execSync(
      "wmic path Win32_PerfFormattedData_PerfProc_Process get IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes /format:csv"
    );
    return res
      .toString()
      .split("\n")
      .map(
        (line): psList.ProcessDescriptor => {
          let res = line.split(",");
          if (!res || res.length != 6 || !/\d+/.test(res[4])) return;
          return {
            ppid: 1,
            pid: parseInt(res[1]),
            cpu: parseInt(res[3]),
            memory: parseInt(res[4]) / getSystemMemoryInfo().total,
            name: res[2],
          };
        }
      )
      .filter((data) => data && data.pid > 0);
  }

  async findIcon(pid: number): Promise<string> {
    return "system.png";
  }
}
