const path = require('path');
const merge = require('webpack-merge');
const commom = require('./webpack.config.js');
const cwddir = process.cwd();

module.exports = merge(commom, {
    mode: 'development',
    devServer: {
        port: 3000,
        compress: true,
        contentBase: [path.resolve(cwddir, 'dist'), path.resolve(cwddir)],
        historyApiFallback: true
    }
});
