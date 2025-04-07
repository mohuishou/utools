import { InitPlugins, Plugin } from "utools-helper";
import { VSCode } from "./vscode";
import { Setting } from "./setting";
import { IDE, ListIDE, NewIDE, NewIDEDefault } from "./ide";
import { Add } from "./add";


try {
  let plugins: Plugin[] = [new IDE(), new Add()]
  plugins = plugins.concat(init())

  InitPlugins(plugins);
} catch (error) {
  alert(error.stack ? error.stack : error);
}


function init(): Plugin[] {
  let ides = ListIDE();
  if (ides.length > 0) {
    return ides;
  }

  NewIDEDefault()
  return ListIDE();
}

