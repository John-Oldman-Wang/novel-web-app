const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const withOffline = require('next-offline');

const config = withOffline({});

const webpackFn = config.webpack;

config.webpack = function(...arg) {
    const [, { isServer }] = arg;
    const result = webpackFn.apply(this, arg);
    if (!isServer) {
        result.optimization.minimizer = [
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true,
                sourceMap: false,
                extractComments: true,
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
        ];
    }
    return result;
};

module.exports = config;
