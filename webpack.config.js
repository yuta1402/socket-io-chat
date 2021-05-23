const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const serverConfig = {
  mode: "development",
  target: "node",
  node: {
    // expressを使うときにはこの設定をしないと失敗します
    // 参考：https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
    __dirname: false,
    __filename: false,
  },
  entry: {
    main: "./src/server/main.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
};

const clientConfig = {
  mode: "development",
  entry: {
    index: "./src/client/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
};

module.exports = [serverConfig, clientConfig];
