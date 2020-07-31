import { InitPlugins } from "./plugin";
import { Setting } from "./config/setting";

InitPlugins([
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
  ]),
]);

setTimeout(() => {
  console.log(Setting.Get("test"));
  console.log(Setting.Get("test2"));
}, 10000);
