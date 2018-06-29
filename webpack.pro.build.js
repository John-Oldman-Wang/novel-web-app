const webpack = require('webpack');
// const fs = require('fs')
// const path = require('path')
const webpackConfig = require('./webpack.config.js')
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

delete webpackConfig.devtool

const options = merge(webpackConfig,{
    mode: 'production',
    plugins: [
        new UglifyJSPlugin()
    ]
})

webpack(options,(err,stats)=>{
    if(err||stats.hasErrors()){
        console.log(err)
    }
    console.log(stats.toString({
        chunks: true,  // Makes the build much quieter
        colors: true    // Shows colors in the console
    }))
})