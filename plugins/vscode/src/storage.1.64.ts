import { readFileSync } from "fs";

export interface Storage {
  "telemetry.machineId": string;
  lastKnownMenubarData: LastKnownMenubarData;
  windowsState: WindowsState;
}

export interface LastKnownMenubarData {
  menus: Menus;
}

export interface Menus {
  File: File;
}

export interface File {
  items: FileItem[];
}

export interface FileItem {
  id: string;
  label?: string;
  submenu?: Submenu;
  enabled?: boolean;
}

export interface Submenu {
  items: SubmenuItem[];
}

export interface SubmenuItem {
  id: string;
  label?: string;
  enabled?: boolean;
  uri?: URI;
  remoteAuthority?: string;
}

export interface URI {
  $mid: number;
  fsPath?: string;
  external?: string;
  path: string;
  scheme: Scheme;
  authority?: string;
}

export enum Scheme {
  File = "file",
  VscodeRemote = "vscode-remote",
}

export interface WindowsState {
  lastActiveWindow: LastActiveWindow;
  openedWindows: any[];
}

export interface LastActiveWindow {
  folder: string;
}

export function GetFiles(path: string) {
  let data = JSON.parse(readFileSync(path).toString()) as Storage;
  let recent = data.lastKnownMenubarData.menus.File.items.find(
    (item) => item.id == "submenuitem.32"
  );
  let items = recent.submenu.items.filter(
    (item) => item.id.includes("openRecent") && item.uri
  );
  return items.map((item) => {
    if (item.uri.scheme === Scheme.VscodeRemote) {
      return decodeURIComponent(item.uri.external);
    }
    return item.uri.path;
  });
}
