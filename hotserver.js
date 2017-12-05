var config = require("./webpack.config.js");
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8000/");

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
});
server.listen(8000);