const http=require('http')
const iconv=require('iconv-lite')
module.exports=function(url,cb){
    try{
        http.get(url,function(res){
            var buf=new Buffer('')
            res.on('data',function(chunk){
                buf=Buffer.concat([buf,chunk])
            })
            res.on('end',()=>{
                cb&&cb(buf)
                buf=null
            })
        })
    }catch(e){
        throw e
    }
}
function req(url,callbake){
    request(url,function(err,res,body){
        var content_type=res.headers['content-type']
        var charset=content_type.replace(/^.*charset=(.*)$/,'$1')
        callbake&&callbake(err,res,res.buffer)
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
}
/*
module.exports=function(url,cb){
    request('http://www.biquge5200.com/',function(err,res,body){
        //console.log(Buffer.isBuffer(res.buffer))
        cb&&cb(err,res,res.buffer)
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
*/