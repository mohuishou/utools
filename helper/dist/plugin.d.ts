import { Action, CallbackListItem } from "../@types/utools";
export declare class ListItem<T = any> implements CallbackListItem {
    title: string;
    description: string;
    data: T;
    icon?: string;
    constructor(title: string, data?: any, desc?: string, icon?: string);
    static error(msg: string): ListItem<any>;
}
export interface Plugin {
    code: string;
    mode?: "doc" | "list" | "none";
    placeholder?: string;
    enter?<T = any>(action?: Action): Promise<ListItem<T>[]> | void;
    search?<T = any>(word: string, action?: Action): Promise<ListItem<T>[]> | void;
    select<T = any, U = any>(item: ListItem<T>, action?: Action): Promise<ListItem<U>[]> | void;
}
export declare function InitPlugins(plugins: Plugin[]): void;
