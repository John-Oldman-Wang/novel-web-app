var path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app:[path.resolve(__dirname, './www/entry/main.js')]
    },
    output: {
        publicPath: "",
        path: path.resolve(__dirname, './www/output'),
        filename: 'bundle.js',
    },
    module:{
        rules:[
            {test: /\.js$/, exclude : /node_modules/,loader :"babel-loader"}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './www/entry/index.html' }),
        new webpack.optimize.UglifyJsPlugin({
            // uglifyOptions: {
            //     ie8: false,
            //     ecma: 8,
            //     mangle: {
            //         properties: {
            //             // mangle property options
            //         }
            //     },
            //     output: {
            //         comments: false,
            //         beautify: false,
            //     },
            //     warnings: false
            // },
            warnings: true,
            minimize: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ]
};