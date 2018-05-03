var mongoose = require('mongoose');
mongoose.Promise = Promise
var Schema = mongoose.Schema;

var loggerSchema = new Schema({
    method: String,
    url: String,
    referer: String,
    host: String,
    connection: String,
    'x-response-type': String,
    'x-real-ip': String,
    'user-agent': String,
    'accept': String,
    'accept-encoding': String,
    'accept-language': String,
    'if-none-match': String,
    createAt: {
        type: Date,
        default: Date.now()
    }
})

loggerSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = Date.now()
    }
    next()
})

loggerSchema.statics = {
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
    }
}

var logger = mongoose.model('logger', loggerSchema)
module.exports = logger