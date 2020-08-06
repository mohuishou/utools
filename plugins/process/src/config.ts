import { IConfigItem } from "utools-helper";

export const config: IConfigItem[] = [
  {
    name: "order",
    label: "排序设置",
    type: "select",
    required: true,
    options: [
      { label: "cpu 使用率倒序", value: "cpu_desc" },
      { label: "mem 使用率倒序", value: "mem_desc" },
    ],
  },
];
