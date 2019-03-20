var path = require('path');

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// 可以避免把 node_modules 里面的依赖包引入打包文件
const nodeExternals = require('webpack-node-externals');

let name = 'index';
let isMini = process.env.npm_lifecycle_event == 'mini' ? true : false;
let entryName = isMini ? `${name}.min` : `${name}`;

module.exports = {
    mode: isMini ? 'production' : 'development',

    entry: {
        [entryName]: './src/components/index.js'
    },

    devtool: isMini ? '' : 'source-map',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'TfReactFormFields',
        libraryTarget: 'umd'
    },

    devServer: {
        historyApiFallback: true,
        inline: true
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
        ]
    },

    externals: [nodeExternals({
        // whitelist: ['lodash.debounce', 'tf-request', 'react-amap', 'tf-map-sign-component']
    })],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "env", "stage-0", "react"
                        ],
                        plugins: [["import", {
                            "libraryName": "antd",
                            "style": 'css',   // or 'css'
                        }]]
                    },

                }

            },
            {
                test: /\.css$/, // 解析css
                include: path.join(__dirname, 'src'),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/, // 解析less
                include: path.join(__dirname, 'src'),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(woff2|woff|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'assets/fonts/[name].[hash:7].[ext]',
                }
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
}

