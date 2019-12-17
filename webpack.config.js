const path = require("path");
const copyPlugin = require("copy-webpack-plugin");

function resolve(file) {
  return path.resolve(__dirname, file);
}

module.exports = {
  target: "node",
  devtool: "inline-source-map",
  entry: {
    otp: resolve("src/otp/preload.ts")
  },
  output: {
    filename: "[name]/preload.js",
    path: resolve("dist")
  },
  plugins: [
    new copyPlugin([
      {
        from: "src/**/icon.png",
        to: "[folder]/[name].[ext]"
      },
      {
        from: "src/**/README.md",
        to: "[folder]/[name].[ext]"
      },
      {
        from: "src/**/plugin.json",
        to: "[folder]/[name].[ext]"
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },

  externals: [
    (function() {
      var IGNORES = ["electron"];
      return function(context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ]
};
