const path = require("path");
const fs = require("fs");

/**
 * @description 获取当前 vscode storage.json 路径
 */
function getStoragePath() {
  return path.join(utools.getPath("appData"), "Code", "storage.json");
}

function search(keyword) {
  let data = fs.readFileSync(getStoragePath());
  data = JSON.parse(data);
  return data.openedPathsList.workspaces3
    .filter((file, index, arr) => {
      return (
        // 去重
        arr.indexOf(file) == index &&
        // 排除远程开发
        file.indexOf("vscode-remote") != 0 &&
        // 搜索
        file.indexOf(keyword) > -1
      );
    })
    .map(file => {
      // 格式化返回数据
      file = decodeURIComponent(file);
      return {
        title: path.basename(file),
        description: file.replace(/^.*?\:\/+/, ""),
        icon: "icon.png"
      };
    });
}

module.exports = {
  search
};
