var express = require('express')


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
app.get('/',function(req,res,next){
    res.setHeader('Cache-Control','no-cache')
    Novel.find({chapterNumber:{$lt:10}},{title:1,author:1,image:1,chapterNumber:1,lastUpdateTime:1,introduction:1}).limit(100).exec(function(err,novels){
        console.log(novels.length)
        if(err){
            next&&next(err)
            return
        }
        res.render('index',{
            title:"index",
            novels:novels
        })
        console.log(novels[0].base64id)
    })
})
app.get('/novel',function(req,res){
    var buf=Buffer.from(req.query.n||'','base64')
    Novel.findById(buf.toString(),function(err,novel){
        if (err) {
            next && next(err)
            return
        }
        res.render('novel',{
            title:'《'+novel.title+"》---"+webName,
            novel:novel
        })
    })
})
app.get('/novel/list',function(req,res,next){
    //console.log(next.toString())
    var n=parseInt(req.query.page)
    Novel.find({},{title:1,author:1,introduction:1,lastUpdateTime:1,chapterNumber:1,image:1}).skip(n*100).limit(100).exec(function(err,novels){
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

