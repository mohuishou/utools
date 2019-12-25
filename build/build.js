const config = require("./webpack.base");
const path = require("path");
const copyPlugin = require("copy-webpack-plugin");
const AddVendorPlugin = require("./plugin");

function resolve(file) {
  return path.resolve(__dirname, "../", file);
}

module.exports = name => {
  return Object.assign(config, {
    entry: {
      preload: resolve(`src/${name}/preload.ts`)
    },
    output: {
      filename: "[name].js",
      path: resolve(`dist/${name}`)
    },
    plugins: [
      new AddVendorPlugin([resolve(`dist/${name}`)]),
      new copyPlugin([
        {
          from: `src/${name}/icon.png`,
          to: "[name].[ext]"
        },
        {
          from: `src/${name}/README.md`,
          to: "[name].[ext]"
        },
        {
          from: `src/${name}/plugin.json`,
          to: "[name].[ext]"
        }
      ])
    ]
  });
};
