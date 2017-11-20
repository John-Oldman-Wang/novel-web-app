const cheerio = require('cheerio')
const request = require('request')
const http = require('http')
var path = require('path')
const url = require('url')
const iconv = require('iconv-lite')
const mongoose = require('mongoose')
var _ = require('underscore')



// 自定义模块和model引入
var Novel = require('./models/m-novel.js')
var Chapter = require('./models/m-chapter.js')
var req = require('./crawler/httpget.js')

//常量申明
var dburl = "mongodb://localhost:27017/novelAppNew"
// 再封装mongoose
mongoose.Promise = Promise
mongoose.close = function () {
    this.connection.close()
}
mongoose.on = function () {
    this.connection.on.apply(this.connection, arguments)
}
mongoose.on('open', function (err) {
    if (err) console.log('err', err)
    console.log(`connect ${mongoose.connection.db.s.databaseName} sucess`)
    // Novel.count({}).exec(function(err,result){
    //     console.log(result)
    //     mongoose.close()
    // })
})
mongoose.on('close', function (err) {
    if (err) console.log('err', err)
    console.log(`mongoose close`)
    process.abort()
})
mongoose.connect = mongoose.connect.bind(mongoose, dburl, {
    useMongoClient: true
})
// 
mongoose.connect()

function fetch(cb, endFn){
    var i=0
    var self = this
    this.count({}).exec(function (err,count) {
        var count = count
       
        self.find({}).skip(i).limit(1).exec(function circle_cb(err, result) {
            if (result)
                cb.apply(this, arguments)
            i++
            console.log(i, '/', count)
            if (i == count) {
                console.log('fetch is complete!')
                endFn&&endFn()
                return
            }
            self.find({}).skip(i).limit(1).exec(circle_cb)
        })
    })
    
}
fetch.bind(Novel)(function (err, novels){
    if(err){
        console.log(err)
        return 
    }
    if(!'title' in novels[0]){
        console.log(novels)
        return
    }
    console.log(novels[0].title)
    //need more logic code
},function(){
    mongoose.close()
})