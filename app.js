var express = require('express')


var app=express()
var dburl="mongodb://localhost:27017/novelApp"
var mongoose=require('mongoose')
var Novel=require('./models/m-novel.js')

var port=3000

mongoose.connect(dburl,{
    useMongoClient: true,
})

app.set('view engine','ejs')
app.set('views','./views')
app.get('/',function(req,res,next){
    res.setHeader('Cache-Control','no-cache')
    Novel.find({}).limit(100).exec(function(err,novels){
        if(err){
            next&&next(err)
            return
        }
        res.render('index',{
            title:"index",
            novels:novels
        })
    })
})
app.get('/novel',function(req,res,next){
    //console.log(next.toString())
    var n=parseInt(req.query.page)
    Novel.find({},{title:1,author:1,introduction:1,lastUpdateTime:1,chapter_number:1,image:1}).skip(n*100).limit(100).exec(function(err,novels){
        if(err){
            next&&next(err)
            return
        }
        res.render('index',{
            title:'novelpage',
            novels:novels
        })
    })
})
app.get('/search',function(req,res,next){
    var keyword=req.query.key.replace(/[\\\/]\./g,'')
    var reg=new RegExp(keyword)
    Novel.find({title:reg}).limit(10).exec(function(err,novels){
        if(err){
            next&&next(novels)
            return
        }
        res.render('index',{
            title:'search',
            novels:novels
        })
    })
})

app.use(function(err,req,res,next){
    console.log(err)
    res.end('hhhh')
})

app.listen(port,function(err){
    if(err)
        return console.log(err)
    console.log(`service start at ${port}`)
})

