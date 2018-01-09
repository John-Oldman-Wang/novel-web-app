var request = require('request')

var count = 0
var max=5
var list=[]
function Req(url, callbake) {
    if (count < max){
        count++ 
        req(url, function (err, res, body){
            callbake.bind(this)(err, res, body)
            count--
            if (list.length!=0){
                var obj = list.shift()
                Req(obj.url, obj.callbake)
            }
        })
    }else{
        list.push({
            url, callbake
        })
    }
}
function req(url, callbake) {

    request(url, { timeout: 5000 }, function (err, res, body) {
        if (err && (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT')){
            req(url,callbake)
            return
        }
        callbake && callbake.bind(this)(err, res, !!res && 'buffer' in res ? res.buffer : body)
    }).on('response', function (res) {
        var buf = new Buffer('')
        res.on('data', function (chunk) {
            buf = Buffer.concat([buf, chunk])
        })
        res.on('end', function () {
            res.buffer = buf
        })
    })
}
Req.setMax=function(n){
    return typeof n == "number" && (max=n)
}
module.exports = Req