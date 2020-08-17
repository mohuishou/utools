import { IConfigItem } from "utools-helper";

export const configs: IConfigItem[] = [
  {
    name: "token",
    type: "input",
    tips: "语雀 Token 为空时默认通过 OAuth2 获取，一般情况无需手动设置",
  },
  {
    name: "window_width",
    label: "窗口宽度",
    type: "input",
    tips: "小窗打开时的窗口宽度",
    default: 1000,
  },
  {
    name: "window_height",
    label: "窗口高度",
    type: "input",
    tips: "小窗打开时的窗口高度",
    default: 750,
  },
  {
    name: "history_count",
    label: "历史记录",
    type: "input",
    tips: "最大暂存的历史记录条数",
    default: 10,
  },
  // {
  //   name: "daily_repo",
  //   label: "速记知识库",
  //   type: "input",
  //   tips: "每日速记创建的知识库",
  // },
  // {
  //   name: "daily_parent_node",
  //   label: "速记父目录Slug",
  //   type: "input",
  //   tips: "每日速记文档创建的父目录slug",
  // },
];
