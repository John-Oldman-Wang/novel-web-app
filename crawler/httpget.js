var request=require('request')


/*function req(url,callbake){
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
}*/
function req(url,callbake){
    console.log(`start get ${url}`)
    request(url,{timeout:5000},function(err,res,body){
        //console.log('do cb')
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