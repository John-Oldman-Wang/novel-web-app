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
require('./config/router/router.js')(app)
app.listen(port, function (err) {
    if (err)
        return console.log(err)
    console.log(`service start at ${port}`)
})