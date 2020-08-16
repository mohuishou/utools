import { IConfigItem } from "utools-helper";

export const configs: IConfigItem[] = [
  {
    name: "sources",
    label: "视频源",
    default: `618G免费解析@https://jx.618g.com/?url=
8090g@https://www.8090g.cn/jiexi/?url=
石头解析@https://jiexi.071811.cc/jx.php?url=
接口A@http://jx.598110.com/?url=
接口B@http://vip.jlsprh.com/?url=`,
    type: "textarea",
    tips: "视频源一行一个, 源名称@源地址，示例请参考默认设置",
  },
];
