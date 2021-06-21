import { CallbackListItem } from "./template_plugin";
export interface IListItem<T = any> extends CallbackListItem {
  title: string;
  description: string;
  data: T;
  icon?: string;
  operate?: string;
  [key: string]: any;
}

export class ListItem<T = any> implements IListItem {
  title: string;
  description: string;
  data: T;
  icon?: string;
  operate?: string;
  [index: string]: any;

  constructor(title: string, desc?: string, data?: any, icon: string = "icon.png") {
    this.title = title;
    this.description = desc ? desc : title;
    this.data = data ? data : this.description;
    this.icon = icon;
  }

  static error(msg: string) {
    return new ListItem("错误", msg);
  }
}
