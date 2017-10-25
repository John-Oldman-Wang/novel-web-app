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
var Novel=require('./models/m-novel.js')
var req=require('./crawler/httpget.js')

//常量申明
var dburl="mongodb://localhost:27017/novelApp"
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
})
mongoose.connect=mongoose.connect.bind(mongoose,dburl,{
    useMongoClient: true
})
// 
mongoose.connect()

var origin='https://www.qidian.com'
var path='/free/all'
var query='?orderId=&vip=hidden&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=1&page='

var novelList_urls=[];
var interval=0
for(var i=1;i<2;i++){
var novelList_urls=[];
    novelList_urls.push(origin+path+query+i)
}

req(novelList_urls.shift(),function cicle_cb(err,res,buffer){
    if(err){
        if(err.code=='ESOCKETTIMEDOUT'||err.code=='ETIMEDOUT'){
            console.log(`get ${this.uri.href} ${err.code}`)
            novelList_urls.unshift(this.uri.href)
        }else{
            console.log(`get ${this.uri.href} ${err.code}`)
        }
    }else{
        var body=Buffer.isBuffer(buffer)?buffer.toString():res.body
        var href=res.request.uri.href
        var mes=filterNovelListPage(body,href)
        console.log(mes)
    }
    if(novelList_urls.length==0){
        console.log('爬取完成!')
        mongoose.cloes()
    }else{
        req(novelList_urls.shift(),cicle_cb)
    }
})


function filterNovelListPage(body,href){
    if(!body||typeof body!='string'){
        console.log('no body')
        return {}
    }
    var $=cheerio.load(body)
    if($('.all-img-list').find('h4').length<1){
        return {}
    }
    var obj=[]
    $('.all-img-list').find('h4').each(function(i,elem){
        var item=url.resolve(href,$(this).find('a').attr('href'))
        obj.push(item)
    })
    return obj
}

function get_novel(arr,cb){
    var arr=arr
    req(arr.shift(),function circle(err,res,buffer){
        if(err){
            if(err.code=='ESOCKETTIMEDOUT'||err.code=='ETIMEDOUT'){
                arr.unshift(this.uri.href)
            }
            console.log(`get ${this.uri.href} ${err.code}`)
        }else{
            var body=buffer.toString()
            var href=res.request.uri.href

        }
        if(arr.length==0){
            cb&&cb()
            return
        }else{
            req(arr.shift(),circle)
        }
    })
}

function filterNovelPage(body,href){
    if(!body||typeof body!='string'){
        console.log('no body')
        return {}
    }
    var $=cheerio.load(body)
    var obj={}
    obj.title=$('.book-information').find('h1').find('em').text()
    obj.author=$('.book-information').find('h1').find('a').text()
    obj.image=url.resolve(href,$('#bookImg').find('img').attr('href'))
    obj.category=$('.tag').find('a.red').text()
    obj.shortintroduction=$('.intro ').text()
    obj.introduction=$('book-intro').find('p').text().trim().replace(/\s+/g,'\n')
}
