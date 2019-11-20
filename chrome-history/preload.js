const Chrome = require("./chrome")
let chrome
utools.onPluginReady(() => {
  chrome = new Chrome()
  if (process.platform != "win32") execSync(`chmod +x "${chrome.searchCmd}"`);
})

window.exports = {
  ch: {
    // 注意：键对应的是plugin.json中的features.code
    mode: "list", // 列表模式
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        // 如果进入插件就要显示列表数据
        callbackSetList(new Chrome().search(""));
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList(new Chrome().search(searchWord));
      },
      // 用户选择列表中某个条目时被调用
      select: selected,
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "请输入关键词搜索项目"
    }
  },
  chs: {
    // 注意：键对应的是plugin.json中的features.code
    mode: "list", // 列表模式
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        // 如果进入插件就要显示列表数据
        callbackSetList(chrome.setting(""));
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList(chrome.setting(searchWord));
      },
      // 用户选择列表中某个条目时被调用
      select: selected,
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "请输入Chrome Profile路径"
    }
  }
};

function selected (action, item) {
  window.utools.hideMainWindow();
  if ('url' in item) require('electron').shell.openExternal(itemData.url)
  if ('copy' in item) {
    require('electron').clipboard.writeText(item.copy)
    utools.showNotification(item.description, item.copy)
  }
  if ('path' in item) {
    chrome.updateProfile(item.path)
  }
  window.utools.outPlugin();
}