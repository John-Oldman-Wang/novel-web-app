const { URL } = require('url');
const path=require('path')
const url=require('url')
const request = require('request')
var hostname='www.biqudu.com'
const myURL = new URL('https://www.biqudu.com/asdakdjasd/');
request('/asdasd',function(err){
    //console.log('err',err)
})


console.log(url.resolve('https://www.baidu.com/first/second','https://www.baidu.com/join/joinwaht'))
console.log('asd')