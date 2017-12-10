var express = require('express')
const fs=require('fs')

var app=express()
var dburl="mongodb://localhost:27017/novelApp2"
var mongoose=require('mongoose')
var Novel=require('./config/models/m-novel.js')
var Chapter=require('./config/models/m-chapter.js')

var port=3000
mongoose.connect(dburl,{
    useMongoClient: true,
})
app.use(function(req,res,next){
    if (req.headers['x-response-type'] == 'multipart') {
        console.log('multipart:%s %s %s', req.method, req.url);
    } else {
        console.log('not multipart:%s %s %s', req.method, req.url);
    }
    next();
})
app.set('view engine','ejs')
app.set('views','./config/views')

app.get('/',function(req,res){
    fs.createReadStream('./www/output/index.html').pipe(res)
})
app.get('/index',function(req,res,next){
    if(req.headers){
        if (req.headers['x-response-type'] =='multipart'){
            Novel.findLast(20,function(err,novels){
                res.json({
                    novels:novels
                })
            })
        }
    }else{
        next&&next()
    }
})
app.get('/novel',function(req,res,next){
    if (req.headers['x-response-type'] == 'multipart') {
        Novel.findById(req.query.v, function (err, novel) {
            res.json(novel)
        })
    } else {
        next && next()
    }
})
app.get('/chapter', function (req, res, next) {
    if (req.headers['x-response-type'] == 'multipart') {
        Chapter.findById(req.query.c, function (err, chapter) {
            res.json(chapter)
        })
    } else {
        next && next()
    }
})
app.get('/bundle.js',function(req,res){
    fs.createReadStream('./www/output//bundle.js').pipe(res)
})

app.get('/test',function(req,res){
    fs.createReadStream('./www/entry/test.html').pipe(res)
})
app.get('/search',function(req,res,next){
    if (req.headers['x-response-type'] == 'multipart') {
        Novel.find({title:req.query.key}, function (err, novels) {
            res.json(novels)
        })
    } else {
        next && next()
    }
})
app.get('/test1',function(req,res){
    fs.createReadStream('./www/entry/test1.html').pipe(res)
})

app.use(function(req,res){
    fs.createReadStream('./www/output/index.html').pipe(res)
})
//require('./config/router/router.js')(app)

app.listen(port,function(err){
    if(err)
        return console.log(err)
    console.log(`service start at ${port}`)
})

