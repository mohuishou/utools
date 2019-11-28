const path = require("path");
const fs = require("fs");

/**
 * @description 获取当前 vscode storage.json 路径
 */
function getStoragePath () {
  return path.join(utools.getPath("appData"), "Code", "storage.json");
}

function search (keyword) {
  try {
    let data = fs.readFileSync(getStoragePath());
    data = JSON.parse(data);
    let files = data.openedPathsList.workspaces3;

    // 搜索
    let keywords = keyword.split(/\s+/g);
    for (let i = 0; i < keywords.length; i++) {
      const word = keywords[i];
      files = files.filter((file, index, arr) => {
        return (
          // 去重
          arr.indexOf(file) == index &&
          // 排除远程开发
          file.indexOf("vscode-remote") != 0 &&
          // 搜索
          file.toLowerCase().indexOf(word.trim().toLowerCase()) > -1
        );
      });
    }

    return files.map(file => {
      // 格式化返回数据
      file = decodeURIComponent(file);
      return {
        title: path.basename(file),
        description: file.replace(/^.*?\:\/+/, ""),
        icon: "icon.png"
      };
    });
  } catch (error) {
    alert(error)
  }
}

module.exports = {
  search
};
