const request = require('request');
const { promisify } = require('util');
const mongoose = require('mongoose');
const url = require('url');
const iconv = require('iconv-lite');

const cheerio = require('cheerio');
var Novel = require('../config/models/m-novel.js');
var Chapter = require('../config/models/m-chapter.js');

var dburl = 'mongodb://localhost:27017/novelApp';

// mongoose.connect(dburl, {
//     useMongoClient: true,
// })
mongoose.Promise = Promise;

mongoose.close = function() {
    this.connection.close();
};
mongoose.on = function() {
    this.connection.on.apply(this.connection, arguments);
};
mongoose.on('open', function(err) {
    if (err) console.log('err', err);
    console.log(`connect ${mongoose.connection.db.s.databaseName} sucess`);
});
mongoose.on('close', function(err) {
    if (err) console.log('err', err);
    console.log(`mongoose close`);
    process.abort();
});
const req = promisify(function(href, cb) {
    request(href, { timeout: 5000 }, function(err, res, body) {
        if (err && (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT')) {
            console.log(`${href} time out,request again!`);
            cb(null, req(href));
            return;
        } else {
            cb(null, err || res);
        }
        return;
    }).on('response', function(res) {
        var buf = new Buffer('');
        res.on('data', function(chunk) {
            buf = Buffer.concat([buf, chunk]);
        });
        res.on('end', function() {
            res.buffer = buf;
        });
    });
});
(async function() {
    var indexUrl = 'http://www.505book.com/';
    var fiters = require('./505book.js');
    await mongoose.connect(
        dburl,
        {
            useMongoClient: true
        }
    );

    try {
        var r = await req(indexUrl);
        console.log('--->', r.request.uri.href);
        //----
        // mongoose.close()
        // return
        //---
        var urls = fiters.filterUrlsOfNovels(r);
        var urls = [...new Set(urls)];
        var href, result, obj;
        for (; urls.length > 0; ) {
            href = urls.shift();
            result = await req(href);
            obj = fiters.filterMesOfNovels(result);
            var _novel = new Novel(obj);
            _novel.save(function(err, novel) {
                console.log(`${novel.title} save ok`);
            });
        }
    } catch (error) {
        console.log(error);
    }
    mongoose.close();
})();
