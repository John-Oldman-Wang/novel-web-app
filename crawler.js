const cheerio = require('cheerio')
const request = require('request')
const http = require('http')
var path = require('path')
const url=require('url')
const iconv=require('iconv-lite')
const mongoose=require('mongoose')
var _=require('underscore')

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
var dburl="mongodb://localhost:27017/novelApp"
mongoose.connect=mongoose.connect.bind(mongoose,dburl,{
    useMongoClient: true
})
mongoose.connect()
var Novel=require('./models/m-novel.js')

var origin='http://www.biqudu.com'

var novel_urls=[];
var interval=0
for(var i=1;i<70651;i++){
    novel_urls.push(origin+'/1_'+i)
}

req(novel_urls.shift(),function circle_cb(err,res,buffer){
    if(err){
        console.log('request wrong',err.code)
        if(err.code=='ESOCKETTIMEDOUT'){
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
    }else if(res.statusCode!='200'){
        console.log(res.request.uri.href,':',res.statusCode)
        if(novel_urls.length==0){
            console.log('爬取完成!')
            mongoose.close()
            return
        }
        setTimeout(function(){
            req(novel_urls.shift(),circle_cb)
        },interval)
    }else{
        var charset=getCharsetFromResHeaders(res.headers)
        var href=res.request.uri.href
        console.log(`get ${href} success`)
        var body=Buffer.isBuffer(buffer)?iconv.decode(buffer,charset):buffer
        var mes=filterNovelMessage(body,res.request.uri.href)
        if(!mes.title){
            console.log('这个地址没有小说信息')
            if(novel_urls.length==0){
                console.log('爬取完成!')
                mongoose.close()
                return
            }
            setTimeout(function(){
                req(novel_urls.shift(),circle_cb)
            },interval)
            return
        }else if(mes.chapters.length==0){
            console.log(`这个地址${href}是个没有章节的小说`)
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
        Novel.find({title:mes.title}).exec(function(err,novels){
            var _novel
            if(err){
                return console.log('查找数据库标题相同的小说出错,需要查看数据库服务是否良好')
            }else if(!novels.length){
                _novel=new Novel(mes)
            }else{
                _novel=_.extend(novels[0],mes)
            }
            _novel.save(function(err,novel){
                if(err){
                    console.log('novel save err',err)
                }else{
                    console.log(`${novel.title} save ok`)
                }
                if(novel_urls.length==0){
                    console.log('爬取完成!')
                    mongoose.close()
                    return
                }
                setTimeout(function(){
                    req(novel_urls.shift(),circle_cb)
                },interval)
            })
        })
    }
})

function req(url,callbake){
    console.log(`start get ${url}`)
    request(url,{timeout:5000},function(err,res,body){
        console.log('do cb')
        if(!!res&&'headers' in res){
            var content_type=res.headers['content-type']
            var charset=content_type.replace(/^.*charset=(.*)$/,'$1')
        }else{
            console.log('headers not in res')
        }
        callbake&&callbake.bind(this)(err,res,res&&'buffer' in res?res.buffer:body)
    }).on('response',function(res){
        var buf=new Buffer('')
        res.on('data',function(chunk){
            buf=Buffer.concat([buf,chunk])
        })
        res.on('end',function(){
            res.buffer=buf
        })
    })
}
function filterNovelMessage(body,href){
    if(!body){
        console.log('no body')
        return {}
    }
    if(typeof body!='string'){
        console.log('body must be String!')
        return {}
    }
    var obj={}
    var $=cheerio.load(body)
    if(!$('#list').length){
        console.log('this is not page of novel',$('#list').length)
        return {}
    }
    obj.title=$('.box_con').eq(0).find('h1').eq(0).text()
    obj.author=$('.box_con').eq(0).find('h1').eq(0).next().text().replace(/\s/g,'').replace('作者','').replace(/[:：]/g,'')
    var category_ele=$('#bdshare').parent()

    category_ele.children().remove()
    obj.category=category_ele.text().replace(/\s/g,'').replace(/^>([^>]+)>[^>]+$/,'$1')
    obj.introduction=$('#intro').text().replace(/\s/g,'')
    obj.lastUpdateTime=new Date($('.box_con').eq(0).find('h1').eq(0).next().next().next().text().trim().replace('最后更新:','').replace('最后更新：',''))
    obj.year=obj.lastUpdateTime.getFullYear()
    obj.image=url.resolve(href,$('#fmimg').find('img').attr('src'))
    //return obj
    obj.chapters=[]
    $('#list').find('a').each(function(){
        var ele=$(this)
        var chapter={}
        chapter.title=ele.text().trim()
        chapter.serial=ele.text().trim().split(' ')[0]
        chapter.href=url.resolve(origin,ele.attr('href'))
        obj.chapters.push(chapter)
    })
    return obj
}




function filterForUrl(body,href){
    var $=cheerio.load(body)
    var url_set=new Set()
    $('a').each(function(){
        url_set.add(url.resolve(href,$(this).attr('href')))
        console.log(url.resolve(href,$(this).attr('href')),'<-',$(this).attr('href'))
    })
    var url_arr=[...url_set]
    return url_arr
}
function getCharsetFromResHeaders(headers){
    var content_type=headers['content-type']
    if(content_type.indexOf('charset')==-1)
        return 'utf8'
    var charset=content_type.replace(/^.*charset=(.*)$/,'$1')
    return charset
}