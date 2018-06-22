const express = require('express')

var Novel = require('../models/m-novel.js')
var Chapter = require('../models/m-chapter.js')
const dataServer = express()


if(process.env.NODE_ENV !== 'production'){
    dataServer.use((req,res,next)=>{
        setTimeout(() => {
            next&&next()
        }, 1500);
    })
    console.log(`开发环境延迟1.5秒返回数据！`)
}


// sign up 未做完
dataServer.post('/signup',function(req,res){
    let buf = new Buffer('')
    req.on('data',(buffer)=>{
        buf=Buffer.concat([buf,buffer])
    })
    req.on('end',()=>{
        res.end(buf.toString())
    })
})

// 
dataServer.get('/index', function (req, res, next) {
    Novel.random(21, function (err, novels) {
        if (err) {
            console.log(err)
        }
        res.json({
            novels: novels
        })
    })
})

// 获取分类小说
dataServer.get('/category', function (req, res) {
    if (!req.query.c) {
        res.json({
            novels: []
        })
        return
    }
    var reg = new RegExp(req.query.c, 'g')
    Novel.find({
        category: reg
    }, {
            href: 0,
            meta: 0,
            "chapters.href": 0
        }).limit(20).then(function (novels) {
            res.json({
                novels: novels
            })
        })
})

// 获取小说数据
dataServer.get('/novel', function (req, res, next) {
    Novel.findOne({
        _id: req.query.v
    }, {
            href: 0,
            meta: 0,
            "chapters.href": 0
        }).exec(function (err, novel) {
            res.json(novel)
        })
})

// 获取章节数据
dataServer.get('/chapter', function (req, res, next) {
    if (req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1) {
        //处理无参数传入
        if (req.query.c == "") { }
        Chapter.findOne({
            _id: req.query.c
        }, {
                href: 0,
                meta: 0
            }).exec(function (err, chapter) {
                res.json(chapter)
            })
    } else {
        next && next()
    }
})

// 查找小说
dataServer.get('/search', function (req, res, next) {
    var key = req.query.key//.replace()
    var reg = new RegExp(key.split('').join('.*'), 'g')
    Novel.find({
        title: reg
    }, {
        href: 0,
        meta: 0
    }).limit(20).exec(function (err, novels) {
        res.json(novels)
    })
})

dataServer.use((req,res)=>{
    res.json({})
})

module.exports = dataServer;