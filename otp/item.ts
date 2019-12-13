import { CallbackListItem } from "../@types/utools";

export default class Item<T> implements CallbackListItem {
  title: string;
  description: string;
  data: T;
  icon?: string;

  constructor(title: string, data?: any) {
    this.title = title;
    this.description = title;
    this.icon = "icon.png";
    this.data = data;
  }

  static error(msg: string) {
    let item = new Item("错误");
    item.description = msg;
    return item;
  }
}
