const HtmlWebPackPlugin = require("html-webpack-plugin");
let CleanWebpackPlugin = require('clean-webpack-plugin');
let webpack = require('webpack');
let path = require('path')

module.exports = {
  entry: './src/index.js',

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              "env", "stage-0", "react"
            ],
            "plugins": [["import", {
              "libraryName": "antd",
              "style": 'css',   // or 'css'
            }]]
          }

        }
      },
      {
        test: /\.css$/, // 解析css
        // include: path.join(__dirname, 'src'), //限制范围，提高打包速度
        use: ['style-loader', 'css-loader', 'postcss-loader'] // 从右向左解析
      }, {
        test: /\.less$/, // 解析less
        // include: path.join(__dirname, 'src'), 
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      }, {
        test: /\.(woff2|woff|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/fonts/[name].[hash:7].[ext]',
        }
      }

    ]
  },

  devServer: {
    contentBase: './dist',
    // host: 'localhost',      // 默认是localhost
    port: 3001,             // 端口
    open: true,             // 自动打开浏览器
    hot: true,               // 开启热更新
    disableHostCheck: true
  },

  output: {
    // 1. filename: 'bundle.js',
    // 2. [name]就可以将出口文件名和入口文件名一一对应
    filename: '[name].js',   // 打包后会生成index.js和login.js文件
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    // html
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      hash: true, // 会在打包好的bundle.js后面加上类似于: ?6ce91c19b9054fff5a05 串
    }),

    // 打包前先清空
    // new CleanWebpackPlugin('dist'),

    new webpack.HotModuleReplacementPlugin()
  ]
};