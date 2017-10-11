const { URL } = require('url');
const request = require('request')
var hostname='www.biqudu.com'
const myURL = new URL('https://www.biqudu.com/asdakdjasd/');
request('/asdasd',function(err){
    console.log('err',err)
})
console.log('asd')