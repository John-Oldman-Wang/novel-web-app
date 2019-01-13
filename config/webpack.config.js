const cwddir = process.cwd();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outPath = path.resolve(cwddir, './dist');
const entryPath = path.resolve(cwddir, './src/client');

module.exports = {
    entry: path.resolve(entryPath, './index.js'),
    output: {
        path: outPath,
        publicPath: '/',
        filename: '[name]-[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: cwddir,
            verbose: true,
            dry: false
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(entryPath, './index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        })
    ]
};
