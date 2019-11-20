const { execSync } = require("child_process");
const { join } = require("path");
const fs = require("fs");

let chromeVersion = {
  title: "文件夹不存在或文件夹不含chrome历史数据库, 请在 chrome 查看 profile 路径信息",
  description: "请在Chrome地址栏输入chrome://version查看",
  copy: "chrome://version"
};

class chrome {
  constructor() {
    let profile = utools.db.get(utools.getLocalId());
    if (!profile) {
      this.updateProfile(this.getDefaultProfile());
      profile = utools.db.get(utools.getLocalId());
    }
    this.profile = profile.path;
    this.tmp = utools.getPath("temp");
    this.searchCmd = this.getSearchCmd();
    if (process.platform != "win32") execSync(`chmod +x "${this.searchCmd}"`);
  }

  getSearchCmd () {
    let filename = "search_" + process.platform;
    if (process.platform == "win32") filename = "search_windows";
    let cmd = join(__dirname, filename);
    if (__dirname.indexOf("asar") > -1)
      cmd = join(__dirname + ".unpacked", filename);
    return cmd
  }

  search (keywords) {
    try {
      let cmd = `"${this.searchCmd}" -p="${this.profile}" -q=${keywords} -t=${this.tmp}`;
      let stdout = execSync(cmd);
      let items = JSON.parse(stdout);
      let set = new Set();
      return items
        .filter((item, index, arr) => {
          if (!set.has(item.url)) return item;
          set.add(item.url);
        })
        .map(item => {
          item.description = item.url;
          if (!item.icon) item.icon = "chrome.png";
          return item;
        });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  setting (path) {
    path = path.trim();
    if (!path || !fsExistsSync(join(path, "History")))
      return [
        chromeVersion,
        {
          title: "请输入profile目录地址",
          description: "当前profile地址: " + this.profile,
          copy: this.profile
        }
      ];
    return [
      {
        title: "回车确认设置Profile",
        description: path,
        path: path
      }
    ];
  }

  updateProfile (path) {
    let profile = utools.db.get(utools.getLocalId());
    if (!profile) profile = { _id: utools.getLocalId() };
    profile.path = path;
    console.log(utools.db.put(profile));
  }

  getDefaultProfile () {
    let data = utools.getPath("appData");
    switch (process.platform) {
      case "darwin":
        return join(data, "Google/Chrome/Default");
      case "win32":
        return join(data, "../Local/Google/Chrome/User Data/Default");
      case "linux":
        return join(data, "google-chrome/default");
    }
  }
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync (path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}

module.exports = chrome;
