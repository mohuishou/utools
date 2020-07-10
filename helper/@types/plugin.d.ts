import { Action, CallbackListItem, TplFeatureMode } from "../@types/utools";
export interface IListItem<T = any> extends CallbackListItem {
    title: string;
    description: string;
    data: T;
    icon?: string;
    operate?: string;
    [key: string]: any;
}
export declare class ListItem<T = any> implements IListItem {
    title: string;
    description: string;
    data: T;
    icon?: string;
    operate?: string;
    [index: string]: any;
    constructor(title: string, desc?: string, data?: any, icon?: string);
    static error(msg: string): ListItem<any>;
}
export interface Plugin {
    code: string;
    mode?: TplFeatureMode;
    placeholder?: string;
    enter?<T = any>(action?: Action): Promise<IListItem<T>[]> | void;
    search?<T = any>(word: string, action?: Action): Promise<IListItem<T>[]> | void;
    select?<T = any, U = any>(item: IListItem<T>, action?: Action): Promise<IListItem<U>[]> | void;
}
export declare function InitPlugins(plugins: Plugin[]): void;
