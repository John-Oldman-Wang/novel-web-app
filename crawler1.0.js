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
var path='/free/all?page=1&vip=hidden&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=1'
var query='?page=1&vip=hidden&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=1'

var novelList_urls=[];
var interval=0
for(var i=1;i<25000;i++){
    novelList_urls.push(origin+path+query+i)
}
var novelMessage_urls=[]
// req(novelList_urls.shift(),function cicle_cb(err,res,buffer){
//     if(err){
//         if(err.code=='ESOCKETTIMEDOUT'||err.code=='ETIMEDOUT'){
//             console.log(`get ${this.uri.href} ${err.code}`)
//             novelList_urls.unshift(this.uri.href)
//         }else{
//             console.log(`get ${this.uri.href} ${err.code}`)
//         }
//     }else{
//         var body=Buffer.isBuffer(buffer)?buffer.toString():res.body
//         var href=res.request.uri.href
//         var mes=filterNovelListPage(body,href)
//         console.log(mes)
//     }
//     if(novelList_urls.length==0){
//         console.log('爬取完成!')
//         mongoose.cloes()
//     }else{
//         req(novelList_urls.shift(),cicle_cb)
//     }
// })
function async(arr,fn,cb,enddo){
    if(!Array.isArray(arr)||arr.length==0){
        //console.log(Array.isArray(arr))
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
            novel_urls.unshift(this.uri.href)
        }
        if(novel_urls.length==0){
            console.log('爬取完成!')
            mongoose.close()
            return
        }
        setTimeout(function(){
            req(novel_urls.shift(),circle_cb)
        },interval)
        return
    }
    //console.log(body.toString)
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
        console.log(item)
        novelMessage_urls.push(item)
    })

}
//小说信息页，筛选出小说基本信息，标题，等等
function filterNovelMessagePage(err,res,body){
    var href=''

    if(!body||typeof body!='string'&&!Buffer.isBuffer(body)){
        console.log('no body')
        return {}
    }
    body=Buffer.isBuffer(body)?body.toString():body
    href=res.request.uri.href
    var $=cheerio.load(body)

}

async(novelList_urls,req,filterNovelListPage)