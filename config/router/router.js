const fs = require('fs')
var Novel = require('../models/m-novel.js')
var Chapter = require('../models/m-chapter.js')
module.exports = function (app) {
    app.get('/reset.css', function (req, res) {
        res.setHeader('Accept','text/plain')
        fs.createReadStream('./css/reset.css').pipe(res)
    })
    app.get('/main.css', function (req, res) {
        fs.createReadStream('./css/main.css').pipe(res)
    })
    app.get('/favicon.ico', function (req, res) {
        res.end('404')
    })
    app.get('/bundle.js', function (req, res) {
        fs.createReadStream('./www/output//bundle.js').pipe(res)
    })
    app.get('/vendor.js', function (req, res) {
        fs.createReadStream('./www/output/vendor.js').pipe(res)
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
            Novel.findOne({_id:req.query.v},{href:0,meta:0,"chapters.href":0}).exec(function (err, novel) {
                res.json(novel)
            })
        } else {
            next && next()
        }
    })
    app.get('/chapter', function (req, res, next) {
        if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
            //处理无参数传入
            if(req.query.c==""){}
            Chapter.findOne({_id:req.query.c},{href:0,meta:0}).exec(function (err, chapter) {
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