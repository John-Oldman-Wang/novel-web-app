var mongoose = require('mongoose');
mongoose.Promise=Promise
var Schema = mongoose.Schema;

var novelSchema=new Schema({
    title:String,
	author: String,
	category:String,
	shortintroduction:String,
    introduction:String,
	lastUpdateTime:Date,
	state:String,
    year:Number,
	image:String,
	chapterNumber:Number,
    chapters:[{
        title:String,
		serialName:String,
		serial:String,
		href:String,
		chapter_id: Schema.Types.ObjectId
    }],
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

novelSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}
	else{
		this.meta.updateAt=Date.now()
	}
	if ('chapters' in this && this.chapters.length != this.chapterNumber){
		this.chapterNumber=this.chapters.length
	}
	next()
})

novelSchema.statics={
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
var novel=mongoose.model('Novel',novelSchema)
module.exports=novel