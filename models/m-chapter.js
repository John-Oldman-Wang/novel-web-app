var mongoose = require('mongoose');
mongoose.Promise=Promise
var Schema = mongoose.Schema;
var ObjectId=Schema.Types.ObjectId
var chapterSchema=new Schema({
    title:String,
    paragraphs:[String],
    novel:ObjectId,
    meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

chapterSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}
	else{
		this.meta.updateAt=Date.now()
	}

	next()
})

chapterSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}
var chapter=mongoose.model('Chpater',chapterSchema)
module.exports=chapter