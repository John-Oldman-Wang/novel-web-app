const cheerio = require('cheerio')
const request = require('request')
const http = require('http')
var path = require('path')
const url = require('url')
const iconv = require('iconv-lite')
const mongoose = require('mongoose')
var _ = require('underscore')

var ObjectId = mongoose.Types.ObjectId

// 自定义模块和model引入
var Novel = require('../config/models/m-novel.js')
var Chapter = require('../config/models/m-chapter.js')
var req = require('./httpget.js')
var async=require('./async.js')
//常量申明
var dburl = "mongodb://localhost:27017/novelApp1"
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


var errNovel = 0
function fetch(cb, endFn){
    //var i=0
    var self = this
    self.find({ "chapters.chapter_id": null}).limit(1).exec(function circle_cb(err, result) {
        cb.call(this, err ,result ,function(skipNumber=errNovel){
            self.find({ "chapters.chapter_id": null }).skip(skipNumber).limit(1).exec(circle_cb)
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
        console.log(`close mongo after 3 second `)
        setTimeout(() => {
            mongoose.close()
        }, 3000);
        return
    }else{
        getChapters(novels[0],next||function(){})
    }
})
function getChapters(novel,cb){
    function filterChapterPage(err, res, body ,serial) {
        var href = ''
        if (err) {
            console.log('request wrong', err.code, this.uri.href)
            if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
                console.log(`get ${this.uri.href} timeout`)
                chapter_hrefs.unshift(this.uri.href)
                return 'ETIMEOUT'
            }else{
                return false
            }
            
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
        var title = $('.text-head').find('.j_chapterName').text().trim()
        if (/^第[十|百|千|万|一|二|三|四|五|六|七|八|九|零|\d]+章/g.test(title)) {
            var serialName = title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/, '$1')
            obj.title = title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/, '$2').trim().replace(serialName, '').trim()
        } else if (parseInt(title.replace(/^[^\d]*(\d*).*/, '$1')) == serial) {
            var serialName = title.replace(/^[^\d]*(\d*).*/, '$1')
            obj.title = title.replace(serialName, '').replace(/【|】|(第章)/g, '').replace(/^章/,'').trim()
        } else {
            obj.title = title.trim()
        }
        $('.read-content').find('p').each(function () {
            obj.paragraphs.push($(this).text().trim())
        })
        return obj
    }
    var chapter_hrefs=novel.chapters.filter(function(item,index){
        return typeof item=='object'&&(!item.chapter_id)
    })    
    chapter_hrefs=chapter_hrefs.map(function(item){
        return item.href
    })
    console.log(novel.title, chapter_hrefs.length)
    var flag=chapter_hrefs.length
    async(chapter_hrefs,req,function(err,res,body){
        var chapter
        for(var i=0;i<novel.chapters.length;i++){
            if (this.uri.href == novel.chapters[i].href){
                chapter=filterChapterPage.call(this, err, res, body, novel.chapters[i].serial) 
                break;
            }
        }
        
        if(typeof chapter=='object'){
            //准备好新抓取来的chapter
            chapter.href=this.uri.href
            chapter.novel_id=novel._id
            //开始查询数据库
            Chapter.find({title:chapter.title,novel_id:novel._id,href:chapter.href}).exec(function(err,chapters){
                var _chapter = ''
                if(err){
                    console.log('查找数据库是否有刚爬到的章节时放生错误',err)
                    mongoose.close()
                    return
                }else if (!chapters || !chapters.length){
                    _chapter = new Chapter(chapter)
                    _chapter.save(function (err, chapter) {
                        if (err) {
                            console.log(`chapter save err`, err)
                            novel.save(function () {
                                mongoose.close()
                            })
                            return
                        } else {
                            novel.chapters.forEach(function (item, index, arr) {
                                if (item.href == chapter.href) {
                                    arr[index].chapter_id = chapter._id
                                }
                            })
                            flag-=1
                            if(flag==0){
                                novel.save(function(err,Novel){
                                    if(err){
                                        console.log(`抓取玩章节保存小说 \x1B[34m ${Novel.title}\x1B[39m 出错`,err)
                                        mongoose.close()
                                        return
                                    }else{
                                        console.log(`小说:\x1B[34m ${Novel.title}\x1B[39m的章节保存完成!`)
                                        cb&&cb()
                                    }
                                })
                            }
                        }
                    })
                }else{
                    console.log('数据库有重复的章节!',chapter.title)
                    for(var c=0;c<novel.chapters.length;c++){
                        if (novel.chapters[c].href == chapters[0].href) {
                            novel.chapters[c].chapter_id = chapters[0]._id
                            console.log('数据库有重复的章节!,已经更新入小说',c, chapters[0]._id)
                            break;
                        }
                    }
                    flag-=1
                    if(flag==0){
                        novel.save(function(err,Novel){
                            if(err){
                                console.log(`抓取玩章节保存小说 \x1B[34m ${Novel.title}\x1B[39m 出错`,err)
                                mongoose.close()
                                return
                            }else{
                                console.log(`小说:\x1B[34m ${Novel.title}\x1B[39m的章节保存完成!`)
                                cb&&cb()
                            }
                        })
                    }
                }
            })
        }else if(chapter=='ETIMEOUT'){
            console.log(`筛选章节信息超时 \x1B[34m ${this.uri.href}\x1B[39m`)
        }else{
            console.log(`筛选章节信息出错 \x1B[34m ${this.uri.href}\x1B[39m`)
            flag+=1000000
            cb && cb(++errNovel)
            return 'stop'
        }
    }, function () {
        //cb&&cb()
        console.log(`${novel.title} all of http request is complete!`)
    })
}


