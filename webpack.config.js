var path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        app: path.resolve(__dirname, './www/entry/main.js'),
        //vendor: ['react', 'react-dom', 'react-router-dom','moment']
    },
    output: {
        publicPath: path.resolve(__dirname, './www/output'),
        path: path.resolve(__dirname, './www/output'),
        filename: 'bundle.js',
    },
    module:{
        rules:[
            {test: /\.js$/, exclude : /node_modules/,loader :"babel-loader"}
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
                reduce_vars: true,
            }
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./www/output/vendor-manifest.json')
        })
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'vendor.js'
        // })
    ]
};