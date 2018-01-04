var express = require('express')
const fs = require('fs')

var app = express()
var dburl = "mongodb://localhost:27017/novelApp1"
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
    if (["/favicon.ico", "/reset.css", "/main.css", "/vendor.js", "/bundle.js"].indexOf(req.url) > -1) {
        next()
        return
    } else if (req.headers["user-agent"].indexOf('python') > -1) {
        res.end('404')
        return
    } else {
        var obj = Object.assign({}, req.headers)
        obj.method = req.method
        obj.url = decodeURI(req.url)
        var _logger = new Logger(obj)
        _logger.save(function (err, log) {
            if (err) {
                console.log(err)
            } else {
                // console.log(`save log ok`)
            }
        })
        // console.log(_logger)
        next();
    }
})
require('./config/router/router.js')(app)
app.listen(port, function (err) {
    if (err)
        return console.log(err)
    console.log(`service start at ${port}`)
})