import { IConfigItem } from "utools-helper";

export const config: IConfigItem[] = [
  {
    name: "featured",
    label: "是否精选",
    type: "select",
    required: true,
    default: "",
    options: [
      { label: "所有图标", value: "" },
      { label: "精选图标", value: "fromCollection" },
    ],
  },
  {
    name: "color",
    label: "颜色筛选",
    type: "select",
    required: true,
    default: "1",
    options: [
      { label: "单色", value: "0" },
      { label: "多色", value: "1" },
    ],
  },
  {
    name: "type",
    label: "图标类型",
    type: "select",
    default: "",
    required: true,
    options: [
      { label: "全部", value: "" },
      { label: "线性", value: "line" },
      { label: "面性", value: "fill" },
      { label: "扁平", value: "flat" },
      { label: "手绘", value: "hand" },
      { label: "简约", value: "simple" },
      { label: "精美", value: "complex" },
    ],
  },
  {
    name: "size",
    label: "大小",
    type: "input",
    required: true,
    default: 300,
  },
  {
    name: "fill_color",
    label: "图标颜色",
    type: "input",
    placeholder: "设置后会强制修改图标颜色，多色图标会被修改为单色，一般情况下请勿设置",
    required: false,
    default: "",
  },
];
