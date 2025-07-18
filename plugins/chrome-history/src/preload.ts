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

async function callback(action: callbackAction): Promise<callbackRetrun[]> {
  if (ch.code != action.code || action.type != "over") return [];
  try {
    let items = (await ch.search(action.payload))
    // 根据 url 去重
    const map = new Map();
    items = items.filter(item => {
      let url = new URL(item.description)
      url.search = ""
      return !map.has(url.toString()) && map.set(url.toString(), true)
    })
    let results = items.map(
      (item): callbackRetrun => {
        // 这个模式下展示的是 text
        let text = `${item.title} - ${item.description}`
        return { title: item.description, icon: item.icon, text: text };
      }
    );
    return results
  } catch (error) {
    console.error(error)
  }
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

utools.onMainPush(callback as any, selectCallback);
