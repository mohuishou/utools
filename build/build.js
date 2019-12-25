const path = require("path");
const config = require("./webpack.base");
const copyPlugin = require("copy-webpack-plugin");
const AddVendorPlugin = require("./plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function resolve(file) {
  return path.resolve(__dirname, "../", file);
}

module.exports = name => {
  let plugins = [
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
  ];
  if (process.env.ENV != "dev") plugins.push(new CleanWebpackPlugin());

  return Object.assign({}, config, {
    entry: {
      preload: resolve(`src/${name}/preload.ts`)
    },
    output: {
      filename: "[name].js",
      path: resolve(`dist/${name}`)
    },
    plugins: plugins
  });
};
