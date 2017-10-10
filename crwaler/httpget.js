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