import { IProcess } from "./process";
import psList = require("ps-list");
const fileIcon = require("file-icon");

export class MacProcess implements IProcess {
  async processes(): Promise<psList.ProcessDescriptor[]> {
    return await psList();
  }

  async findIcon(pid: number): Promise<string> {
    return (
      "data:image/png;base64," +
      Buffer.from(await fileIcon.buffer(pid)).toString("base64")
    );
  }
}
