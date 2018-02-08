var express = require('express')
const fs = require('fs')

var app = express()
var mongoose = require('mongoose')
var Novel = require('./config/models/m-novel.js')
var Chapter = require('./config/models/m-chapter.js')
var Logger = require('./config/models/m-logger.js')
const { port, dbUrl } = require('./config/config.js') 

mongoose.connect(dbUrl, {
    useMongoClient: true,
})

app.set('view engine', 'ejs')
app.set('views', './config/views')
require('./config/router/router.js')(app)
app.listen(port, function (err) {
    if (err)
        return console.log(err)
    console.log(`service start at http:\/\/localhost:${port}`)
})