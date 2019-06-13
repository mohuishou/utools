const { exec } = require("child_process");
const path = require("path");
const open = require("open");

window.search = (query, p) => {
  let cmd = path.join(__dirname, "chrome-history");
  let tmp = utools.getPath("temp");
  return new Promise((resolve, reject) => {
    exec(`${cmd} -p="${p}" -q="${query}" -t="${tmp}"`, (err, stdout, stderr) => {
      if (err) {
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
};

window.openBrowser = open;
