import { IConfigMap, IConfig, Setting } from "utools-helper";

const configs: IConfig[] = [
  {
    name: "test",
    value: "default",
    validate: /[a-z]+/g,
  },
];

export const Settings = new Setting("setting", configs);

setInterval(() => {
  console.log(Settings.test);
}, 1000);
