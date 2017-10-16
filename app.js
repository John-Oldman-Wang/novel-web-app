var express = require('express')


var app=express()


app.set('view engine','ejs')
app.set('views','./views')
app.get('/',function(req,res){
    res.setHeader('Cache-Control','no-cache')
    res.render('index',{
        novels:[{ title : 'hehe'},{ title : 'hehe'}]
    })
})


app.listen(3000)

