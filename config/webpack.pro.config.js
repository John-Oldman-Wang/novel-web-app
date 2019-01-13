const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const merge = require('webpack-merge');
const commom = require('./webpack.config.js');

module.exports = merge(commom, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: `/`
        })
    ],
    optimization: {
        nodeEnv: 'production',
        // splitChunks: {
        //   chunks: 'all',
        //   name: false
        // },
        runtimeChunk: true,
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_console: true
                    },
                    mangle: true,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false
                }
            })
        ]
    }
});
