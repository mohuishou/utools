window.exports = {
  keepass: {
    // 注意：键对应的是plugin.json中的features.code
    mode: "list", // 列表模式
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        // 如果进入插件就要显示列表数据
        callbackSetList({
          title: "xxx",
          description: "xxx"
        });
        // var d = dialog({
        //   title: '欢迎',
        //   content: '欢迎使用 artDialog 对话框组件！'
        // });
        // d.show();
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList({
          title: "xxx",
          description: "xxx"
        });
      },
      // 用户选择列表中某个条目时被调用
      select: (action, itemData) => {
        window.utools.hideMainWindow();
        window.utools.outPlugin();
      },
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "请输入关键词搜索项目"
    }
  }
};
