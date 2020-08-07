import { InitPlugins, Plugin } from "./plugin";
import { Setting } from "./config/setting";
import { ListItem } from "./listItem";

class Test implements Plugin {
  code = "utools-helper-list";

  enter() {
    return [new ListItem("test")];
  }
}

InitPlugins([
  new Test(),
  Setting.Init("utools-helper", [
    {
      name: "test",
      type: "input",
      label: "测试",
      placeholder: "请输入测试配置",
      default: "test",
    },
    {
      name: "test2",
      type: "input",
      label: "测试2",
      default: "这是我设置的默认值",
    },
    {
      name: "test3",
      type: "select",
      options: [
        {
          label: "t1",
          value: "1",
        },
        {
          value: "2",
        },
      ],
      label: "测试2",
    },
  ]),
]);

setTimeout(() => {
  console.log(Setting.Get("test"));
  console.log(Setting.Get("test2"));
}, 10000);
