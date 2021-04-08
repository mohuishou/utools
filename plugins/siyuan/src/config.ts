import { join } from "path";
import { platform } from "process";
import { IConfigItem } from "utools-helper";

export const config: IConfigItem[] = [
  {
    name: "url",
    label: "搜索地址",
    type: "input",
    required: true,
    tips: "一般情况无需修改，一般使用本机地址: http://localhost:6806",
    default: "http://127.0.0.1:6806/api/query/sql",
    only_current_machine: true,
  },
  {
    name: "sql",
    label: "sql",
    type: "input",
    tips: "sql 语句，$search_word$ 为占位符，会被替换为搜索的关键词",
    required: true,
    default: "select * from blocks where markdown like '%$search_word% limit 20'",
    only_current_machine: true,
  },
];
