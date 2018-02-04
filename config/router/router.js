const fs = require('fs')
var Novel = require('../models/m-novel.js')
var Chapter = require('../models/m-chapter.js')
var Logger = require('../models/m-logger.js')
var express = require("express")
module.exports = function (app) {
    
    app.use(express.static('dist'))
    app.get('/favicon.ico', function (req, res) {
        fs.createReadStream('./web/ic_local_library_black_48dp_1x.png').pipe(res)
    })
    app.get('/favicon.svg', function (req, res) {
        fs.createReadStream('./web/ic_local_library_black_48px.svg').pipe(res)
    })
    app.get('/favicon.png', function (req, res) {
        fs.createReadStream('./web/ic_local_library_black_48dp_2x.png').pipe(res)
    })
    app.use(function (req, res, next) {
        
        //filter request of crawler
        if (req.headers["user-agent"].indexOf('python') > -1) {
            res.end('404')
            return
        }

        var obj = Object.assign({ 
            method: req.method,
            url: decodeURI(req.url)
        }, req.headers)
        var _logger = new Logger(obj)
        _logger.save().catch(function (err) {
           console.log(err)
        })
        next();
    })
    app.get('/', function (req, res) {
        res.render('index', {
            title: '无限中文小说'
        })
    })
    
    app.get('/index', function (req, res, next) {
        if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
            Novel.findLast(20, function (err, novels) {
                res.json({
                    novels: novels
                })
            })
        } else {
            next && next()
        }
    })
    app.get('/novel', function (req, res, next) {
        if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
            Novel.findOne({ _id: req.query.v }, { href: 0, meta: 0, "chapters.href": 0 }).exec(function (err, novel) {
                res.json(novel)
            })
        } else {
            next && next()
        }
    })
    app.get('/chapter', function (req, res, next) {
        if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
            //处理无参数传入
            if (req.query.c == "") { }
            Chapter.findOne({ _id: req.query.c }, { href: 0, meta: 0 }).exec(function (err, chapter) {
                res.json(chapter)
            })
        } else {
            next && next()
        }
    })
    app.get('/search', function (req, res, next) {
        if (req.headers['x-response-type'] == 'multipart') {
            var key = req.query.key.replace()
            var reg = new RegExp(key.split('').join('.*'), 'g')
            Novel.find({ title: reg }, { href: 0, meta: 0 }).limit(20).exec(function (err, novels) {
                res.json(novels)
            })
        } else {
            next && next()
        }
    })
    //for test
    app.get('/test', function (req, res) {
        fs.createReadStream('./www/entry/test.html').pipe(res)
    })
    app.get('/test1', function (req, res) {
        fs.createReadStream('./www/entry/test1.html').pipe(res)
    })
    app.use(function (req, res) {
        res.render('index', {
            title: '无限中文小说'
        })
    })
}