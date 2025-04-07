import { IListItem, ListItem, Plugin } from "utools-helper";
import { Action } from "utools-helper/dist/template_plugin";
import { NewIDE } from "./ide";
import { NewConfig, SaveConfig } from "./setting";

export class Add implements Plugin {
    code = "vsc-add-ide";

    enter(action?: Action): IListItem[] {
        return this.search(action.payload);
    };

    search(word: string): IListItem[] {
        if (!word) word = "请输入 ide code"
        let item = new ListItem(`${word}`, "回车新建 IDE");
        item.icon = "icon/icon.png";
        return [item];
    }

    select(item: IListItem) {
        let config = NewConfig(item.title)
        NewIDE(config)
        SaveConfig(config)
        utools.showNotification(`创建成功，请输入 ${item.title}-setting 调整配置`)
        utools.outPlugin(true)
    }
}