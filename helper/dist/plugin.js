"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListItem {
    constructor(title, desc, data, icon = "icon.png") {
        this.title = title;
        this.description = desc ? desc : title;
        this.data = data ? data : this.description;
        this.icon = icon;
    }
    static error(msg) {
        return new ListItem("错误", msg);
    }
}
exports.ListItem = ListItem;
class Feature {
    constructor(plugin) {
        this.mode = "list";
        this.args = {
            placeholder: "请输入关键词",
            enter: async (action, cb) => {
                try {
                    if (this.plugin.enter) {
                        let items = await this.plugin.enter(action);
                        if (items)
                            cb(items);
                        return;
                    }
                    if (this.mode != "none") {
                        this.args.search(action, "", cb);
                    }
                }
                catch (error) {
                    this.catchError(error, cb);
                }
            },
            search: async (action, word, cb) => {
                try {
                    if (!this.plugin.search) {
                        return;
                    }
                    let items = await this.plugin.search(word, action);
                    if (items)
                        cb(items);
                }
                catch (error) {
                    this.catchError(error, cb);
                }
            },
            select: async (action, item, cb) => {
                try {
                    if (!this.plugin.select) {
                        return;
                    }
                    let items = await this.plugin.select(item, action);
                    if (items)
                        return cb(items);
                }
                catch (error) {
                    this.catchError(error, cb);
                }
            }
        };
        this.plugin = plugin;
        if (plugin.mode)
            this.mode = plugin.mode;
        if (plugin.placeholder)
            this.args.placeholder = plugin.placeholder;
    }
    catchError(error, cb) {
        console.error(error);
        if (cb) {
            cb({
                title: "错误:" + error.message,
                description: error.message + error.stack
            });
        }
        else {
            alert(error.message);
        }
    }
}
function InitPlugins(plugins) {
    try {
        let features = {};
        plugins.forEach(plugin => {
            features[plugin.code] = new Feature(plugin);
        });
        window.exports = features;
    }
    catch (error) {
        alert(error.message + error.stack);
    }
}
exports.InitPlugins = InitPlugins;
