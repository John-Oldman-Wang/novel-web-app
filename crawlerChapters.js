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
    self.find({}).skip(i++).limit(1).exec(function circle_cb(err, result) {
        cb.call(this, err ,result ,function(){
            self.find({}).skip(i++).limit(1).exec(circle_cb)
        })
    }) 
}
fetch.bind(Novel)(function (err, novels ,next){
    if(err){
        console.log(err)
        mongoose.close()
        return
    }else if(novels.length==0){
        console.log(`fetch novels is complete!`)
        mongoose.close()
        return
    }else{
        console.log(novels[0].title)
        getChapters(novels[0],next||function(){})
    }
})

function getChapters(novel,cb){
    function filterChapterPage(err, res, body) {
        var href = ''
        if (err) {
            console.log('request wrong', err.code, this.uri.href)
            if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
                console.log(`get ${this.uri.href} timeout`)
                chapter_hrefs.push(this.uri.href)
            }
            return false
        }
        if (res.statusCode != '200') {
            console.log(`此页面无章节信息:${this.uri.href}`)
            return false
        }
        if (!body || typeof body != 'string' && !Buffer.isBuffer(body)) {
            console.log(`this page ${this, uri.href} no body`)
            return false
        }
        body = Buffer.isBuffer(body) ? body.toString() : body
        href = res.request.uri.href
        var $ = cheerio.load(body)
        var obj = {}
        obj.paragraphs = []
        obj.title = $('.text-head').find('.j_chapterName').text().split(' ')[1]
        $('.read-content').find('p').each(function () {
            obj.paragraphs.push($(this).text().trim())
        })
        return obj
    }
    var chapter_hrefs=novel.chapters.filter(function(item){
        return typeof item=='object'&&(!item.chapter_id)
    })    
    chapter_hrefs=chapter_hrefs.map(function(item){
        return item.href
    })
    // mongoose.close()
    // return
    var chapters=[]
    async(chapter_hrefs,req,function(err,res,body){
        var chapter=filterChapterPage.call(this,err,res,body)
        if(!chapter){
            //chapter_hrefs.push(this.uri.href)
        }else{
            chapter.href=this.uri.href
            chapter.novel_id=novel._id
            chapters.push(chapter)
        }
    },function(){
        async(chapters, function (chapter,cb){
            var _chapter = new Chapter(chapter)
            _chapter.save(cb)
        },function(err,chapter){
            if(err){
                console.log(`chapter save err`,err)
                novel.save(function(){
                    mongoose.close()
                })
                return
            }else{
                novel.chapters.forEach(function(item,index,arr){
                    if(item.href==chapter.href){
                        arr[index].chapter_id=chapter._id
                    }
                })
            }
        },function(){
            novel.save(function(err,Novel){
                if(err){
                    console.log(err)
                    console.log(`章节爬去完成重新更新小说出错 ${nove.title}`)
                    mongoose.close()
                    return
                }else{
                    //
                   
                    //
                    cb&&cb()
                }
            })
        })
    })
}

function deepClone(object){
    if(typeof object!='object'){
        return object
    }else{
        var newObj=Array.isArray(object)?[]:{}
        for(var i in object){
            newObj[i]=deepClone(object[i])
        }
        return newObj
    }
}
function async(arr, fn, cb, enddo) {
    if (!Array.isArray(arr)) {
        //console.log(Array.isArray(arr))
        throw new Error('the first arguments must be array and lenth must over 0!')
        return
    }else if(arr.length==0){
        enddo && enddo()
        return
    }
    if (typeof fn != 'function' || typeof cb != 'function') {
        throw new Error(`the ${typeof fn != 'function' ? 'second' : 'third'} arguments must be function!`)
        return
    }
    function circle_function() {
        cb.apply(this, arguments)
        if (arr.length == 0) {
            enddo && enddo()
            return
        }
        fn(arr.shift(), circle_function)
    }
    fn(arr.shift(), circle_function)
}




// function filterChapterPage(err, res, body) {
//     var href = ''
//     if (err) {
//         console.log('request wrong', err.code)
//         if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
//             console.log(`get ${this.uri.href} timeout`)
//             if ('arr' in arguments.callee)
//                 arguments.callee.arr.unshift(this.uri.href)
//         }
//         return false
//     }
//     if (res.statusCode != '200') {
//         console.log(`此页面无章节信息:${this.uri.href}`)
//         return false
//     }
//     if (!body || typeof body != 'string' && !Buffer.isBuffer(body)) {
//         console.log(`this page ${this, uri.href} no body`)
//         return false
//     }
//     body = Buffer.isBuffer(body) ? body.toString() : body
//     href = res.request.uri.href
//     var $ = cheerio.load(body)
//     var obj = {}
//     obj.paragraphs = []
//     obj.title = $('.text-head').find('.j_chapterName').text().split(' ')[1]
//     $('.read-content').find('p').each(function () {
//         obj.paragraphs.push($(this).text().trim())
//     })
//     return obj
// }