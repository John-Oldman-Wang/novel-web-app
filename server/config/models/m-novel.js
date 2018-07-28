var mongoose = require('mongoose');
mongoose.Promise = Promise
var Schema = mongoose.Schema;

var novelSchema = new Schema({
	title: String, // 小说标题
	titleWords: [String], // 小说标题文字数组
	author: String, // 小说作者
	categorys: [String], // 小说所在类别数组
	category: String, // 小说主要属于的类别
	smallCategory:String, // 小说次要属于的类别
	shortintroduction: String, // 小说简短介绍
	introduction: String, // 小说完整介绍
	lastUpdateTime: Date, // 小说最后更新时间
	state: String, // 小说状态
	year: Number, // 小说年份
	image: String, // 小说图片地址
	heat: Number, // 小说观看人数
	href: String, // 小说源地址
	isMale:Boolean, // 是否是男性小说
	chapters: [{
		title: String,
		serialName: String,
		serial: String,
		href: String,
		chapter_id: { type: Schema.Types.ObjectId, ref: 'chapter' }
	}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

novelSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}
	if(!this.titleWords || this.titleWords.length==0){
		this.titleWords = this.title.split('');
	}
	if ('chapters' in this && this.chapters.length != this.chapterNumber) {
		this.chapterNumber = this.chapters.length
	}
	next()
})

novelSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({ _id: id })
			.exec(cb)
	},
	findLast: function (count, cb) {
		if (typeof count == 'function') {
			cb = count
			count = 10
		}
		return this.find({}, { href: 0, chapters: 0, meta: 0 })
			.sort({ 'lastUpdateTime': -1 })
			.limit(count).exec(cb)
	},
	random: function(count,cb){
		return this.find({}, { href: 0, chapters: 0, meta: 0 }).skip(Math.random()*1000|0).limit(count).exec(cb)
	},
	search: function(qArray,page){
		return Promise.all([this.count({
			titleWords: {
				$all: qArray
			}
		}),
		this.find({
			titleWords: {
				$all: qArray
			}
		}, {
			href: 0,
			chapters: 0,
			meta: 0
		}).skip(page*10-10).limit(10)]).then(result=>{
			return {
				count: result[0],
				data: result[1],
				page
			}
		})
	}
}


novelSchema.virtual('chapterNumber').get(function () {
	return this.chapters.length
})
novelSchema.virtual('base64id').get(function () {
	var base = new Buffer(this._id.toString())
	return base.toString('base64')
})
var novel = mongoose.model('novel', novelSchema)
module.exports = novel