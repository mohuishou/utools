const { execSync } = require("child_process");
const path = require("path");

function getDBPath () {
  let data = utools.getPath("appData")
  switch (process.platform) {
    case "darwin":
      return path.join(data, "Google/Chrome/Default");
    case "win32":
      return path.join(data, "../Local/Google/Chrome/User Data/Default");
    case "linux":
      return path.join(data, "google-chrome/default");
  }
}

function search (keywords) {
  try {
    filename = "search_" + process.platform
    if (process.platform == 'win32') filename = "search_windows"
    let cmd = path.join(__dirname, filename);

    if (__dirname.indexOf("asar") > -1) cmd = path.join(__dirname + ".unpacked", filename);
    if (process.platform != 'win32') execSync(`chmod +x "${cmd}"`)

    cmd = `"${cmd}" -p="${getDBPath()}" -q=${keywords} -t=${utools.getPath(
      "temp"
    )}`
    let stdout = execSync(cmd);
    let items = JSON.parse(stdout);
    let set = new Set()
    return items
      .filter((item, index, arr) => {
        if (!set.has(item.url)) return item
        set.add(item.url)
      })
      .map(item => {
        item.description = item.url;
        if (!item.icon) item.icon = "chrome.png"
        return item;
      });
  } catch (error) {
    console.log(error)
    alert(error);
  }
}

module.exports = {
  search
};
