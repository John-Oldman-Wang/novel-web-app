const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './web/main.js',
    target: `web`,
    output: {
        path: path.resolve(__dirname, 'server/dist'),
        filename: '[name]-[hash].js'
    },
    module:{
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['env','react'],
                    //     plugins: [
                    //         "syntax-dynamic-import"
                    //     ]
                    // }
                }
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(['server/dist']),
        new HtmlWebpackPlugin({
            template: './web/webpack.template.html'
        })
    ]
}