import { Plugin } from "./plugin";
import { ListItem, IListItem } from "./listItem";
import { DBItem, TplFeature, TplFeatureMode } from "../@types/utools";

export interface IConfig {
  // 配置项的名字. 存储到DB的key
  name: string;
  // 配置项的title，仅用于显示，默认值等于 name
  title?: string;
  // 配置项说明, 仅用于显示，默认值等于 title
  desc?: string;
  // 配置项的值, 初始化设置的值为默认值
  value?: string;
  // 是否必须
  required?: boolean;
  // 配置校验
  validate?: RegExp;

  [key: string]: any;
}

export interface IConfigMap {
  // 配置项的名字 =>
  [name: string]: IConfig;
}

function configsToListItem(configs: IConfig[], prefix?: string): IListItem[] {
  return configs.map((conf) => configToListItem(conf, prefix));
}

function configToListItem(config: IConfig, prefix?: string): IListItem {
  prefix = prefix ? `[${prefix}] ` : "";
  return new ListItem(
    prefix + (config.title ? config.title : config.name) + ": " + config.value,
    config.desc,
    config
  );
}

// 操作: 输入配置项中
export class Setting implements Plugin {
  code: string;
  placeholder = "请输入关键词搜索配置项";
  mode: TplFeatureMode = "list";

  configs: IConfig[];

  // 选中的配置
  chooseConfig: IConfig;

  // 当前的类型
  type: "search_config" | "set_config" = "search_config";

  // 存储到数据库的 key 的前缀
  key: string = "settings";

  outPlugin = true;
  hideMainWindow = true;

  // 索引签名
  [prop: string]: any;

  constructor(code: string, configs: IConfig[]) {
    this.code = code;
    this.configs = configs;

    // 返回一个代理类
    return new Proxy(this, {
      get(obj, prop, reciver) {
        let val = obj.get(String(prop));
        if (val) return val;
        if (obj[String(prop)]) return obj[String(prop)];

        throw new Error("not found:" + String(prop));
      },
    });
  }

  get(key: string): string {
    for (let i = 0; i < this.configs.length; i++) {
      const config = this.configs[i];
      if (config.name === key) return config.value;
    }
    return;
  }

  enter(): IListItem[] {
    let data = utools.db.get<Map<string, any>>(this.key);
    if (data) {
      this.configs.forEach((conf, index) => {
        if (data.data.has(conf.name))
          this.configs[index].value = data.data.get(conf.name);
      });
    }

    this.type = "search_config";
    this.placeholder = "请输入关键词搜索配置项";
    return configsToListItem(this.configs, "搜索");
  }

  search(word: string): IListItem[] {
    if (this.type === "search_config") return this.configSearch(word);
    return this.configEntering(word);
  }

  updateConfig({ name: name, value: value }: IConfig) {
    for (let i = 0; i < this.configs.length; i++) {
      const conf = this.configs[i];
      if (conf.name != name) continue;

      if (conf.validate && !conf.validate.test(value))
        throw new Error(`${value} is not valid ${conf.validate}`);

      let old = conf.value;
      this.configs[i].value = value;

      let data = utools.db.get<Map<string, any>>(this.key);
      if (!data) data = { _id: this.key, data: null };
      data.data = new Map(this.configs.map((conf) => [conf.name, conf.value]));

      let res = utools.db.put(data);
      if (!res.ok) {
        this.configs[i].value = old;
        throw res.error;
      }
      return;
    }

    throw new Error("not found key: " + name);
  }

  configSearch(word: string): IListItem[] {
    return configsToListItem(
      this.configs.filter((conf) => {
        for (const key in conf) {
          let val = conf[key];
          if (typeof val === "string" && val.includes(word)) return true;
        }
        return false;
      }),
      "搜索"
    );
  }

  configEntering(word: string): IListItem[] {
    return [
      new ListItem(
        "[更新] " +
          (this.chooseConfig.title
            ? this.chooseConfig.title
            : this.chooseConfig.name) +
          ": " +
          word,
        "请输入您的配置信息",
        { name: this.chooseConfig.name, value: word }
      ),
    ];
  }

  select(item: IListItem<IConfig>): IListItem[] {
    if (this.type === "search_config") {
      this.chooseConfig = item.data;
      this.type = "set_config";
      this.placeholder = "请输入配置的值";
      return this.search(item.data.value);
    }

    this.updateConfig(item.data);
    utools.showNotification("设置保存成功");
    return;
  }
}
