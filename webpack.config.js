const path = require("path");

module.exports = {
  target: "node",
  watch: true,
  devtool: "inline-source-map",
  entry: "./otp/preload.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
        // exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "preload.js",
    path: path.resolve(__dirname, "otp/dist")
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
