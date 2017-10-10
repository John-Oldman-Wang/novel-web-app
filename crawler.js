const cheerio = require('cheerio')
const request = require('request')
const http = require('http')
const path = require('path')
const url=require('url')
const iconv=require('iconv-lite')

var hostname='www.biqudu.com'
var urls=['http://www.biqudu.com/']

// request('http://www.biquge5200.com/',(err,res,body)=>{
//     console.log(`err:${err}`)
//     console.log(`statuscode:${res&&res.statusCode}`)
//     console.log(Buffer.isBuffer(body))
//     //console.log(iconv.decode(buf,'gbk'))
//     //console.log(`body:${body}`)
//     //get_url(body)
// })

var buf1=new Buffer('')
var buf2=new Buffer('')
var i=0
var j=0
var r
request('http://www.biquge5200.com/',function(err,res,body){
    //console.log(res)
    var content_type=res.headers['content-type']
    var charset=content_type.replace(/^.*charset=(.*)$/,'$1')
    console.log(charset)
    //console.log(iconv.decode(res.buffer,'gbk'))
}).on('response',function(res){
    var buf=new Buffer('')
    res.on('data',function(chunk){
        buf=Buffer.concat([buf,chunk])
    })
    res.on('end',function(){
        res.buffer=buf
    })
})
// .on('data',function(chunk){
//     buf1=Buffer.concat([buf1,chunk])
// }).on('end',function(){
//     console.log(iconv.decode(buf1,'gbk'))
// })
// http.get('http://www.biquge5200.com/',function(res){
//     var buf=new Buffer('')
//     res.on('data',function(chunk){
//         buf=Buffer.concat([buf,chunk])
//     })
//     res.on('end',function(){
//         console.log(iconv.decode(new Buffer(buf.toString()),'gbk'))
//     })
// })
function get_url(body){
    var $=cheerio.load(body)
    var url_set=new Set()
    $('a').each(function(){
        url_set.add($(this).attr('href')) 
    })
    var url_arr=[...url_set]
    console.log(url_arr)
}