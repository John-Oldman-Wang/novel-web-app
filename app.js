var express = require('express')


var app=express()
var dburl="mongodb://localhost:27017/novelApp"
var mongoose=require('mongoose')
var Novel=require('./models/m-novel.js')
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
            novels:novels
        })
    })
})
app.get('/novel',function(req,res,next){
    //console.log(next.toString())
    var n=parseInt(req.query.page)
    Novel.find({}).skip(n*100).limit(100).exec(function(err,novels){
        if(err){
            next&&next(err)
            return
        }
        res.render('index',{
            novels:novels
        })
    })
})
app.get('/search',function(req,res,next){
    res.render('search')
})
app.get('/s_novel',function(req,res){
    var key=req.query.key
    
})
app.get('/timeout',function(req,res){
    res.setHeader('countent-type','text/html')
})
app.use(function(err,req,res,next){
    console.log(err)
    res.end('hhhh')
})

app.listen(3000)

