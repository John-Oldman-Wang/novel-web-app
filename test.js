const { URL } = require('url');
const path=require('path')
const url=require('url')
const request = require('request')
var hostname='www.biqudu.com'
const myURL = new URL('https://www.biqudu.com/asdakdjasd/');

const mongoose=require('mongoose')
var db=mongoose.connection
var dburl="mongodb://localhost/jack"
//mongoose.Promise=Promise
var close=function(){
    this.close()
}.bind(mongoose.connection)

mongoose.connect(dburl,{
    useMongoClient: true,
},function(err){
    if(err) console.log('err',err)
    console.log(`connect mongo sucess`)
    close()
})
db.on('open',function(){
    console.log('it is open')
})
db.on('close',function(){
    console.log('it is closed')
})
// console.log(mongoose.connection)