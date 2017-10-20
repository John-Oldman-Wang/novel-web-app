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
    Novel.fetch(function(err,novels){
        if(err){
            next&&next('err')
            return
        }
        res.render('index',{
            novels:novels
        })
    })
})
app.use(function(err,req,res,next){
    console.log(err)
    res.end('hhhh')
})

app.listen(3000)

