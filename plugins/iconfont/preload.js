
const iconfont = require("./iconfont.js")
const Mousetrap = require('mousetrap');
const electron = require('electron')

const defaultAction = "enter"
let action = defaultAction
let actions = {
  "enter": download,
  "command": copy,
  "option": browser
}

Mousetrap.bind(["command+enter", "ctrl+enter"], (k) => {
  action = "command"
})
Mousetrap.bind(["option+enter", "alt+enter"], (k) => {
  action = "option"
})

window.exports = {
  iconfont: {
    // 注意：键对应的是plugin.json中的features.code
    mode: "list", // 列表模式
    args: {
      // 进入插件时调用（可选）
      enter: async (action, callbackSetList) => {
        let icon = await iconfont.load()
        // 如果进入插件就要显示列表数据
        callbackSetList(await icon.search("icon"));
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: async (action, searchWord, callbackSetList) => {
        let icon = await iconfont.load()
        // 如果进入插件就要显示列表数据
        callbackSetList(await icon.search(searchWord));
      },
      // 用户选择列表中某个条目时被调用
      select: async (a, itemData) => {
        await actions[action](itemData)
        action = defaultAction
        window.utools.outPlugin()
      },
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "请输入关键词搜索项目"
    }
  }
};


async function download (item) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = item.title + ".png";
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  eleLink.href = await iconfont.svg2png(item.id, item.icon);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

async function copy (item) {
  let dataUrl = await iconfont.svg2png(item.id, item.icon)
  let img = electron.nativeImage.createFromDataURL(dataUrl)
  electron.clipboard.writeImage(img)
  utools.showNotification(item.title + "复制成功")
}

function browser (item) {
  electron.shell.openExternal(item.searchUrl)
}

