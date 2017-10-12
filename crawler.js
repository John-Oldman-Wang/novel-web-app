const cheerio = require('cheerio')
const request = require('request')
const http = require('http')
var path = require('path')
const url=require('url')
const iconv=require('iconv-lite')

var hostname='http://www.biqudu.com'
var urls=['http://www.biqudu.com/']
var novel_urls=[]
for(var i=1;i<111111;i++){
    var path='/1_'+i
    novel_urls.push(url.resolve(hostname,path))
    if(i==10){
        console.log(novel_urls)
    }
}
var json=[]
req(novel_urls.shift(),function cb(err,res,buffer){
    if(!err&&res.statusCode=='200'){
        json.push(res.request.uri.href)
        if(json.length==10){
            console.log(json)
        }
    }else if(err){
        console.log(res.request.ui.href,':',err)
    }else{
        console.log(res.request.ui.href,':',res.statusCode)
    }
    if(novel_urls.length==0){
        return
    }
    req(novel_urls.shift(),cb)
})

function req(url,callbake){
    console.log('url:',url)
    request(url,function(err,res,body){
        if('headers' in res){
            var content_type=res.headers['content-type']
            var charset=content_type.replace(/^.*charset=(.*)$/,'$1')
        }else{
            console.log('headers not in res')
        }
        
        
        callbake&&callbake(err,res,res.buffer)
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
function getCharsetFromResHeaders(headers){
    var content_type=headers['content-type']
    if(content_type.indexOf('charset')==-1)
        return 'utf8'
    var charset=content_type.replace(/^.*charset=(.*)$/,'$1')
    return charset
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

