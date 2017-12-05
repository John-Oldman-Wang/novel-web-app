var path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app:[path.resolve(__dirname, './www/main.js')]
    },
    output: {
        publicPath: "",
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js',
    },
    module:{
        rules:[
            {test: /\.js$/, exclude : /node_modules/,loader :"babel-loader"}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './www/index.html' }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new webpack.NoErrorsPlugin()
    ]
};