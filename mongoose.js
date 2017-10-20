var mongoose = require('mongoose')
mongoose.Promise=Promise


mongoose.close=function(){
    this.connection.close()
}
mongoose.on=function(){
    this.connection.on.apply(this.connection,arguments)
}

module.exports=mongoose