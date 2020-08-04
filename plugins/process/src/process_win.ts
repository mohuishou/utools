import { IProcess } from "./process";
import psList = require("ps-list");
import { execSync } from "child_process";
import { getSystemMemoryInfo } from "process";

export class WinProcess implements IProcess {
  async processes(): Promise<psList.ProcessDescriptor[]> {
    // https://docs.microsoft.com/en-us/previous-versions/aa394323(v=vs.85)
    let res = execSync(
      "wmic path Win32_PerfFormattedData_PerfProc_Process get IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes,CreatingProcessID /format:csv"
    );
    return res
      .toString()
      .split("\n")
      .map(
        (line): psList.ProcessDescriptor => {
          let res = line.split(",");
          if (!res || res.length != 7 || !/\d+/.test(res[5])) return;
          return {
            ppid: parseInt(res[1]),
            pid: parseInt(res[2]),
            cpu: parseInt(res[4]),
            memory: parseInt(res[5]) / getSystemMemoryInfo().total,
            name: res[3],
          };
        }
      )
      .filter((data) => data && data.pid > 0);
  }

  async findIcon(pid: number): Promise<string> {
    return "system.png";
  }
}
