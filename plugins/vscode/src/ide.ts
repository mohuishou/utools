import { IListItem, ListItem, Plugin } from "utools-helper";
import { VSCode } from "./vscode";
import { NewConfig, SaveConfig, Setting, Config, GetVSCodeStoragePath } from "./setting";
import { Action } from "utools-helper/dist/template_plugin";

const BUILTIN_FEATURE_CODES = new Set(["vsc-ide", "vsc-add-ide"]);

function listIDEFeatures(): PluginFeature[] {
    return utools.getFeatures().filter((feature: PluginFeature) => {
        return feature.code && !feature.code.endsWith("setting") && !BUILTIN_FEATURE_CODES.has(feature.code);
    });
}

// 列出所有已安装的 IDE
export function ListIDE(): Plugin[] {
    const features = listIDEFeatures();
    console.log(features)

    let plugins: Plugin[] = []
    for (let feature of features) {
        plugins.push(new VSCode(feature.code), new Setting(feature.code))
    }

    console.log(plugins)
    return plugins
}

// 创建一个新的 IDE，只需要一个 name 即可
export function NewIDE(config: Config) {
    utools.setFeature({
        code: config.code,
        explain: `ide plugin for ${config.code}`,
        cmds: [config.code],
        icon: config.icon,
    })
    utools.setFeature({
        code: `${config.code}-setting`,
        explain: `ide setting for ${config.code}`,
        cmds: [`${config.code}-setting`],
        icon: config.icon,
    })
}

function RemoveIDE(code: string) {
    utools.removeFeature(`${code}-setting`)
    utools.removeFeature(`${code}`)
}

export function NewIDEDefault() {
    NewIDEVsc()
    NewIDECursor()
}

export function NewIDEVsc() {
    let config = NewConfig("vsc")
    config.command = "code"
    config.database = GetVSCodeStoragePath()

    SaveConfig(config)
}

export function NewIDECursor() {
    let config = NewConfig("cursor")
    config.icon = "icon/cursor.png"
    SaveConfig(config)
}


export class IDE implements Plugin {
    code = "vsc-ide"

    async enter(action?: Action): Promise<IListItem[]> {
        return this.search()
    }

    async search(word?: string): Promise<IListItem[]> {
        return listIDEFeatures().map((feature: PluginFeature) => {
            console.log("feature list ", feature)
            let item = new ListItem(feature.code, feature.explain,)
            item.icon = feature.icon || "icon/icon.png"
            return item
        })
    }

    async select(item: IListItem, action?: Action): Promise<IListItem[]> {
        let items = await this.search()
        if (items.length <= 1) { throw new Error("至少需要保留一个 ide") }

        // 让用户确认是否需要删除这个 ide
        let ret = window.confirm(`是否删除 ${item.title} ide`);
        if (!ret) {
            return items
        }

        RemoveIDE(item.title)
        utools.showNotification(`${item.title} 删除成功`)
        return await this.search()
    }
}
