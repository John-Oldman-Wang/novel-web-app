var request=require('request')


function req(url,callbake){
    request(url,{timeout:5000},function(err,res,body){
        callbake&&callbake.bind(this)(err,res,!!res&&'buffer' in res?res.buffer:body)
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

module.exports=req