//第三方模块引入
const cheerio = require('cheerio')
const request = require('request')
const http = require('http')
var path = require('path')
const url=require('url')
const iconv=require('iconv-lite')
const mongoose=require('mongoose')
var _=require('underscore')

// 自定义模块和model引入
var Novel=require('../models/m-novel.js')
var req=require('./httpget.js')

//常量申明
var dburl="mongodb://localhost:27017/novelApp2"
// 再封装mongoose
mongoose.Promise=Promise
mongoose.close=function(){
    this.connection.close()
}
mongoose.on=function(){
    this.connection.on.apply(this.connection,arguments)
}
mongoose.on('open',function(err){
    if(err) console.log('err',err)
    console.log(`connect ${mongoose.connection.db.s.databaseName} sucess`)
})
mongoose.on('close',function(err){
    if(err) console.log('err',err)
    console.log(`mongoose close`)
    process.abort()
})
mongoose.connect=mongoose.connect.bind(mongoose,dburl,{
    useMongoClient: true
})
// 
mongoose.connect()

var origin='https://www.qidian.com'
var path='/free/all'
var search ='?orderId=&vip=hidden&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=1&page='

var novelList_urls=[];
var interval=0
for(var i=1;i<100;i++){
    novelList_urls.push(origin + path + search + i)
}
var novelMessage_urls=[]
function async(arr,fn,cb,enddo){
    if(!Array.isArray(arr)||arr.length==0){
        throw new Error('the first arguments must be array and lenth must over 0!')
        return
    }
    if(typeof fn!='function'||typeof cb!='function'){
        throw new Error(`the ${typeof fn!='function'?'second':'third'} arguments must be function!`)
        return
    }
    function circle_function(){
        cb.apply(this,arguments)
        if(arr.length==0){
            enddo&&enddo()
            return
        }
        fn(arr.shift(),circle_function)
    }
    fn(arr.shift(),circle_function)
}

//小说列表展示页，筛选出小说信息页的url
function filterNovelListPage(err,res,body){
    if(err){
        console.log('request wrong',err.code)
        if(err.code=='ESOCKETTIMEDOUT'||err.code=='ETIMEDOUT'){
            console.log(`get ${this.uri.href} timeout`)
            novelList_urls.unshift(this.uri.href)
        }
        return
    }
    var href=''

    if(!body||typeof body!='string'&&!Buffer.isBuffer(body)){
        console.log('no body')
        return {}
    }
    body=Buffer.isBuffer(body)?body.toString():body
    href=res.request.uri.href
    var $=cheerio.load(body)
    if($('.all-img-list').find('h4').length<1){
        return {}
    }
    $('.all-img-list').find('h4').each(function(i,elem){
        var item=url.resolve(href,$(this).find('a').attr('href'))
        novelMessage_urls.push(item)
    })

}
//小说信息页，筛选出小说基本信息，标题，等等
function filterNovelMessagePage(err,res,body){
    var href=''
    if (err) {
        if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
            console.log(`get ${this.uri.href} timeout`)
            novelMessage_urls.unshift(this.uri.href)
        }else{
            console.log('request wrong', err.code)
        }
        return
    }
    if (res.statusCode!='200'){
        console.log(`此页面无小说信息:${this.uri.href}`)
        return
    }
    if(!body||typeof body!='string'&&!Buffer.isBuffer(body)){
        console.log('no body')
        return {}
    }
    body=Buffer.isBuffer(body)?body.toString():body
    href=res.request.uri.href
    var $=cheerio.load(body)


    var obj={}
    obj.title = $('.book-info').find('h1').find('em').text().trim()
    if(obj.title==''){
        console.log(`此页面无小说信息:${this.uri.href}`)
        return
    }
    obj.href=href
    var n=$('.book-info').find('.intro').next().find('em').eq(1).text()
    var w=$('.book-info').find('.intro').next().find('em').eq(1).next().text().indexOf('万总点击')>-1?10000:1
    obj.heat=Math.round(parseFloat(n)*w)
    obj.author = $('.book-info').find('h1').find('a').text().trim()
    obj.shortintroduction = $('.intro').text().trim()
    obj.introduction = $('.book-intro').find('p').text().trim().replace(/\s/g,'\n')
    var time = $('.update').find('.time').text()
    time = time.replace('更新', '')
    var now=new Date()
    if(time.indexOf('昨日')>-1){
        now.setDate(now.getDate()-1)
    } 
    time = time.replace('今天', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ')
    time = time.replace('昨日', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ')
    obj.lastUpdateTime =new Date(time)
    obj.year=obj.lastUpdateTime.getFullYear()
    obj.image = url.resolve(href,$('.book-img').find('img').attr('src').trim())
    obj.chapters=[]
    if ($('#j-catalogWrap').find('.volume').eq(0).find('h3').text().indexOf('作品相关')>-1){
        $('#j-catalogWrap').find('.volume').slice(1).find('.cf').find('li').each(function (index,ele) {
            var c = {}
            if (/第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章/g.test( $(this).find('a').text().trim() ) || index==0  ){
                if(index==0 && !/第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章/g.test( $(this).find('a').text().trim()) ){
                    c.serialName = '0'
                    c.title=$(this).find('a').text().trim().replace(/【|】/g,'')
                }else{
                    var title=$(this).find('a').text().trim()
                    c.serialName = title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/,'$1')
                    c.title= title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/,'$2').trim().replace(c.serialName,'')
                }
                c.href = url.resolve(href, $(this).find('a').attr('href'))
                obj.chapters.push(c)
            }else if( parseInt( $(this).find('a').text().trim().replace(/^[^\d]*(\d*).*/,'$1') ) ==(index+1) || parseInt( $(this).find('a').text().trim().replace(/^[^\d]*(\d*).*/,'$1') ) ==index ){
                var serial=$(this).find('a').text().trim().replace(/^[^\d]*(\d*).*/,'$1')
                c.serialName=parseInt(serial)+''
                c.title = $(this).find('a').text().trim().replace(serial,'').replace(/【|】/g,'')
                c.href = url.resolve(href, $(this).find('a').attr('href'))
                obj.chapters.push(c)
            }
        })
    }else{
        if(parseInt($('#j-catalogWrap').find('.volume').find('.cf').find('li').eq(0).find('a').text().trim().replace(/^[^\d]*(\d*)[^\d]*/,'$1')) ==1 ){
            $('#j-catalogWrap').find('.volume').find('.cf').find('li').each(function (index,ele) {
                
                var c = {}
                var serial=$(this).find('a').text().trim().replace(/^[^\d]*(\d*).*/,'$1')
                if( parseInt(serial) != (index+1) ){
                    return
                }
                c.serialName=parseInt(serial)+''
                c.title=$(this).find('a').text().trim().replace(serial,'').replace(/【|】/g,'')
                c.href = url.resolve(href, $(this).find('a').attr('href'))
                obj.chapters.push(c)
            })
        }else{
            $('#j-catalogWrap').find('.volume').find('.cf').find('li').each(function (index,ele) {
                if (/第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章/g.test( $(this).find('a').text().trim() ) || index==0  ){
                    var c = {}
                    if(index==0 && !/第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章/g.test( $(this).find('a').text().trim()) ){
                        c.serialName = '0'
                        c.title=$(this).find('a').text().trim().replace(/【|】/g,'')
                    }else{
                        var title=$(this).find('a').text().trim()
                        c.serialName = title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/,'$1')
                        c.title= title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/,'$2').trim().replace(c.serialName,'')
                    }
                    c.href = url.resolve(href, $(this).find('a').attr('href'))
                    obj.chapters.push(c)
                }
            })
        }
    }
    if (obj.chapters.length==0){
        return
    }else if(obj.chapters.length<10){
        console.log(`${obj.title} 章节长度小于10`)
    }
    Novel.find({title:obj.title}).exec(function(err,novels){
        var _novel
        if(err){
            console.log('err:',err)
            console.log('查找数据库是否有刚爬到的小说时放生错误')
            mongoose.close()
            return
        }else if(!novels||!novels.length){
            console.log('数据库无此小说，保存此小说：', obj.title)
            _novel=new Novel(obj)
        }else{
            console.log('数据库有此小说，更新此小说：',novels[0].title)
            for(var i=0;i<novels[0].chapters.length;i++){
                obj.chapters[i] = _.extend(novels[0].chapters[i],obj.chapters[i])
            }
            _novel=_.extend(novels[0],obj)
            if(novels.length>1){
                console.log('查询数据库发现有重复名称的小说,小说名称是:',obj.title)
            }
        }
        _novel.save(function(err,novel){
            if(err){
                console.log(`${_novel.title} save err`,err)
            }else{
                console.log(`${novel.title} save ok`)
            }
        })
    })
}
async(novelList_urls,req,filterNovelListPage,function(){
    console.log(`get all of the list page of novels `)
});


(function(){
    function f(){
        setTimeout((e) => {
            if (novelMessage_urls.length > 0) {
                async(novelMessage_urls, req, filterNovelMessagePage, function () {
                        mongoose.close()
                })
            } else {
                f()
            }
        }, 300);
    }
    f()
})()
