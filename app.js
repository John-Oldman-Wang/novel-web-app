var express = require('express')
const fs = require('fs')

var app = express()
var dburl = "mongodb://localhost:27017/novelApp2"
var mongoose = require('mongoose')
var Novel = require('./config/models/m-novel.js')
var Chapter = require('./config/models/m-chapter.js')
var Logger = require('./config/models/m-logger.js')

var port = 3000
mongoose.connect(dburl, {
    useMongoClient: true,
})

app.set('view engine', 'ejs')
app.set('views', './config/views')
app.use(function (req, res, next) {
    if (req.url != '/favicon.ico' && req.url.indexOf('css')==-1) {
        req.headers.method = req.method
        req.headers.url = req.url
        var _logger = new Logger(req.headers)
        //console.log(_logger)
    }
    next();
})

require('./config/router/router.js')(app)

app.listen(port, function (err) {
    if (err)
        return console.log(err)
    console.log(`service start at ${port}`)
})