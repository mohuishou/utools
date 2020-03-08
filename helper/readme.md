# utools-helper

utool 插件开发辅助包，提供完善代码提示（d.ts），以及模板插件辅助开发功能，支持 typescript

## install

```bash
npm i utools-helper
```

## Usage

设置代码提示

```js
// tsconfig.json
{
  "types": [
    // utools api
    "utools-helper/@types/utools",
    // electron api
    "utools-helper/@types/electron",
    "@types/node"
  ]
}
```

快速添加一个模板插件

```typescript
// preload.ts
import { InitPlugins } from "utools-helper";
import { Storage } from "./storage";

InitPlugins([new Storage()]);

// storage.ts
import { Plugin } from "utools-helper";
import { Action, TplFeatureMode } from "utools-helper/@types/utools";
import { join } from "path";

export function GetStorage(): string {
  let item = utools.db.get<string>(getStorageID());
  if (item && item.data) return item.data;
  return join(utools.getPath("appData"), "Code", "storage.json");
}

function getStorageID(): string {
  return utools.getLocalId() + "storage";
}

export class Storage implements Plugin {
  mode: TplFeatureMode = "none";
  code = "vsc-storage";
  enter(action: Action) {
    let item = utools.db.get<string>(getStorageID());
    if (!item) {
      item = {
        _id: getStorageID(),
        data: action.payload[0].path
      };
    }
    item.data = action.payload[0].path;

    let res = utools.db.put(item);
    if (res.ok) {
      utools.showNotification("storage.json 设置成功", "vsc-setting");
    } else {
      utools.showNotification("storage.json 设置失败");
      throw new Error(JSON.stringify(res));
    }
    utools.hideMainWindow();
    utools.outPlugin();
  }
}
```

## Example

请查看: [vscode](https://github.com/mohuishou/utools/tree/master/vscode)

## Utools API

[请点击查看](https://github.com/mohuishou/utools/blob/master/helper/%40types/utools.d.ts)
