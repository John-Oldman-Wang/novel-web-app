var express = require('express')
const fs=require('fs')

var app=express()
var dburl="mongodb://localhost:27017/novelApp2"
var mongoose=require('mongoose')
var Novel=require('./models/m-novel.js')

var port=3000
var webName=''
var hostName=''
mongoose.connect(dburl,{
    useMongoClient: true,
})

app.set('view engine','ejs')
app.set('views','./views')

app.get('/',function(req,res){
    fs.createReadStream('./build/index.html').pipe(res)
})
app.get('/bundle.js',function(req,res){
    fs.createReadStream('./build/bundle.js').pipe(res)
})
app.use(function(req,res){
    fs.createReadStream('./build/index.html').pipe(res)
})
//require('./config/router.js')(app)

app.listen(port,function(err){
    if(err)
        return console.log(err)
    console.log(`service start at ${port}`)
})

