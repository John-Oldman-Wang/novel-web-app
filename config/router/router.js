const fs = require('fs')
var Novel = require('../models/m-novel.js')
var Chapter = require('../models/m-chapter.js')
var Logger = require('../models/m-logger.js')
var express = require("express")
var crypto = require('crypto')

var { key } = require('../config.js')

const cipher =function cipher(key, text ) {
    var ci = crypto.createCipher('aes-256-cbc', key)
    var r = ''
    r += ci.update(text, 'utf-8', 'hex')
    r += ci.final('hex')
    return r
}.bind(null, key)

const decipher = function cipher(key, text) {
    var ci = crypto.createDecipher('aes-256-cbc', key)
    var r = ''
    r += ci.update(text, 'hex', 'utf-8')
    r += ci.final('utf-8')
    return r
}.bind(null, key)

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
                res.end(cipher(JSON.stringify({
                    novels: novels
                }))) 
            })
        } else {
            next && next()
        }
    })
    app.get('/category', function (req, res) {
        if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
            if (req.query.c) {
                res.end(cipher(JSON.stringify({
                    novels: []
                })))
                return
            }
            var reg = new RegExp(req.query.c, 'g')
            Novel.find({ category: reg }, { href: 0, meta: 0, "chapters.href": 0 }).limit(20).then(function (novels) {
                res.end(cipher(JSON.stringify({
                    novels: novels
                })))
            })
        } else {
            next && next()
        }
    })
    app.get('/novel', function (req, res, next) {
        if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
            Novel.findOne({ _id: req.query.v }, { href: 0, meta: 0, "chapters.href": 0 }).exec(function (err, novel) {
                res.end(cipher(JSON.stringify(novel)))
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
                res.end(cipher(JSON.stringify(chapter)))
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
                res.end(cipher(JSON.stringify(novels)))
            })
        } else {
            next && next()
        }
    })


    app.use(function (req, res) {
        if (req.headers['x-response-type'] == 'multipart') {
            res.end(cipher(JSON.stringify(novels)))
        }
        res.render('index', {
            title: '无限中文小说'
        })
    })
}