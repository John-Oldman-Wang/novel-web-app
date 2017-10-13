var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var novel=new Schema({
    titile:String,
    anthor: String,
    introduction:String,
    lastUpdateTime:Date,
    year:Number,
    image:String,
    chapters:[{
        title:String,
        serial:Number,
        url:String,
        content:Schema.ObjectId
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

module.exports=novel