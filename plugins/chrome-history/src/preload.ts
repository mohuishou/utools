import { InitPlugins, ListItem } from "utools-helper";
import { ChromeHistory } from "./chrome_history";
import { Setting } from "./setting";

let ch = new ChromeHistory();
InitPlugins([ch, new Setting()]);

interface callbackAction {
  code: string;
  type: string;
  payload: any;
}

interface callbackRetrun {
  icon?: string;
  text: string;
  title?: string;
}

function callback(action: callbackAction): callbackRetrun[] {
  if (ch.code != action.code || action.type != "over") return [];
  return ch.searchSync(action.payload).map(
    (item): callbackRetrun => {
      // 这个模式下展示的是 text
      return { title: item.description, icon: item.icon, text: item.title };
    }
  );
}

interface selectCallbackAction {
  code: string;
  type: string;
  payload: any;
  option: { icon?: string; text: string; title?: string };
}

function selectCallback(action: selectCallbackAction) {
  ch.select(
    new ListItem(
      action.option.text,
      action.option.title,
      null,
      action.option.icon
    )
  );
  return false;
}

utools.onMainPush(callback, selectCallback);
