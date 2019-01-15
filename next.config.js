const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const withOffline = require('next-offline');
const config = withOffline({});

const dev = process.env.NODE_ENV !== 'production';

const webpackFn = config.webpack;

config.webpack = function(...arg) {
    const [, { isServer }] = arg;
    const result = webpackFn.apply(this, arg);
    if (!isServer) {
        if (!dev) {
            result.plugins = result.plugins || [];
            result.plugins = [
                ...result.plugins,

                // Read the .env file
                new Dotenv({
                    path: path.join(__dirname, '.env'),
                    systemvars: true
                })
            ];
        }
        // UglifyJsPlugin
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
