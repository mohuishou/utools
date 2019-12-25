const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let conf = {
  mode: "development",
  target: "electron-main",

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    runtimeChunk: "single"
  },
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

if (process.env.ENV != "prod") {
  conf.devtool = "source-map";
  conf.plugins.push(new CleanWebpackPlugin());
}

module.exports = conf;
