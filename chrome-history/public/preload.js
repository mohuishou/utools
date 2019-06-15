const { exec } = require("child_process");
const { shell } = require('electron')
const os = require('os')

window.Utils = {
  platform: os.platform(),
  openBrowser: shell.openExternal,
  search: (cmd, query, p) => {
    let tmp = utools.getPath("temp");
    return new Promise(async (resolve, reject) => {
      exec(`"${cmd}" -p="${p}" -q="${query}" -t="${tmp}"`, (err, stdout) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (error) {
          console.error(stdout);
          resolve({
            title: "出错啦，请查看路径是否出错"
          });
        }
      });
    });
  }
};
