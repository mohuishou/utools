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
        // 适配工作区
        if (typeof (file) === 'object' && "configURIPath" in file) {
          file = file.configURIPath
        }
        return (
          // 确保不报错
          typeof (file) === "string" &&
          // 去重
          (file.includes("workspace") || arr.indexOf(file) == index) &&
          // 排除远程开发
          !file.includes("vscode-remote") &&
          // 搜索
          file.toLowerCase().includes(word.trim().toLowerCase())
        );
      });
    }

    return files.map(file => {
      if (typeof (file) === 'object' && "configURIPath" in file) {
        file = file.configURIPath
      }
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
