const fs = require('fs')
const path = require('path')
var Logger = require('../models/m-logger.js')
var express = require("express")
const dataServer = require('./dataServer.js')
const ssrServer = require('./ssrServer.js')
const isDataRequest = function (req) {
    return req.headers['x-response-type'] == 'multipart' && req.query.pbj == 1
}

const isBrowserRequest = (req) => {
    const url = String(req.url)
    const reg = /(\..*\.)|(\/.*\/)/g
    return req.headers["user-agent"] && !String(req.headers["user-agent"]).includes('python') && !url.includes('.php') && !url.includes('.asp') && !url.includes('.action') && !url.includes('.txt') && !reg.test(url);
}

module.exports = function (app) {
    app.get('/favicon.ico', function (req, res) {
        fs.createReadStream(path.join(__dirname, '../icons/ic_local_library_black_48dp_1x.png')).pipe(res)
    })
    app.get('/favicon.svg', function (req, res) {
        fs.createReadStream(path.join(__dirname, '../icons/ic_local_library_black_48px.svg')).pipe(res)
    })
    app.get('/favicon.png', function (req, res) {
        fs.createReadStream(path.join(__dirname, '../icons/ic_local_library_black_48dp_2x.png')).pipe(res)
    })
    app.use(function (req, res, next) {
        //filter request of crawler
        if (!isBrowserRequest(req)) {
            res.end('404')
            console.log('not isBrowserRequest')
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
        next()
    })

    if(process.env.NODE_ENV !== 'production'){
        console.log(`开发环境打印请求路径`)
        app.use(function (req, res, next) {
            if (isDataRequest(req)) {
                console.log(`${req.method}  ${req.url} dataServer`)
                return dataServer(req, res, next)
                
            }
            console.log(`${req.method}  ${req.url} ssrServer`)
            return ssrServer(req, res, next)
        })
    }else{
        app.use(function (req, res, next) {
            if (isDataRequest(req)) {
                return dataServer(req, res, next)
            }
            return ssrServer(req, res, next)
        })
    }
    return app
}