const { search } = require("./vscode");

window.exports = {
  vsc: {
    // 注意：键对应的是plugin.json中的features.code
    mode: "list", // 列表模式
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        // 如果进入插件就要显示列表数据
        callbackSetList(search(""));
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList(search(searchWord));
      },
      // 用户选择列表中某个条目时被调用
      select: (action, itemData) => {
        window.utools.hideMainWindow();
        require("child_process").exec(`code ${itemData.description}`);
        window.utools.outPlugin();
      },
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "请输入关键词搜索项目"
    }
  }
};
