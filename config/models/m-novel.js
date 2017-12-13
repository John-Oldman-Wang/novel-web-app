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
	heat:Number,
	href:String,
	chapterNumber:Number,
    chapters:[{
        title:String,
		serialName:String,
		serial:String,
		href:String,
		chapter_id: {type:Schema.Types.ObjectId,ref:'chapter'}
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
	},
	findLast:function(count,cb){
		if(typeof count=='function'){
			cb=count
			count=10
		}
		return this.find({},{href:0,chapters:0,meta:0})
		.sort({'lastUpdateTime':-1})
		.limit(count).exec(cb)
	}
}


novelSchema.virtual('base64id').get(function(){
	var base=new Buffer(this._id.toString())
	return base.toString('base64')
})
var novel=mongoose.model('novel',novelSchema)
module.exports=novel