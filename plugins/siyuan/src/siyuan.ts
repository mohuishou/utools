import { Plugin, IListItem, Setting } from "utools-helper";
import Axios from "axios";
export const STORAGE = "vscode_storage";

export class SiYuan implements Plugin {
  code = "siyuan";

  async search(word: string): Promise<IListItem[]> {
    let data = await Axios.post(Setting.Get("url"), {
      stmt: Setting.Get("sql").replace("$search_word", word),
    });

    return data.data.data.map(
      (b: any): IListItem => {
        return {
          title: (b.name || b.content.substr(0, 20)) + ` [${b.box}]`,
          description: b.content,
          data: b,
        };
      }
    );
  }

  async select(item: IListItem): Promise<IListItem[]> {
    utools.shellOpenExternal(`siyuan://notebooks/${item.data.box}/blocks/${item.data.id}`);
    return;
  }
}
