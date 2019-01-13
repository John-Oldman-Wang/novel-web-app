const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loggerSchema = new Schema({
    method: String,
    url: String,
    referer: String,
    host: String,
    connection: String,
    'x-response-type': String,
    'x-real-ip': String,
    'user-agent': String,
    accept: String,
    'accept-encoding': String,
    'accept-language': String,
    'if-none-match': String,
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('logger', loggerSchema);
