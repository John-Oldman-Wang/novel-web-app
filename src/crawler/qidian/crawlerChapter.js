const cheerio = require('cheerio');
const request = require('request');
const http = require('http');
var path = require('path');
const url = require('url');
const iconv = require('iconv-lite');
const mongoose = require('mongoose');
var _ = require('underscore');

var ObjectId = mongoose.Types.ObjectId;

// 自定义模块和model引入
var Novel = require('../../config/models/m-novel.js');
var Chapter = require('../../config/models/m-chapter.js');
var req = require('../httpget.js');
req.setMax(20);
//常量申明
var dburl = 'mongodb://localhost:27017/novelApp1';
// 再封装mongoose
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
mongoose.connect = mongoose.connect.bind(mongoose, dburl, {
    useMongoClient: true
});

var query = {
    'chapters.chapter_id': null
};
var config = {
    any: 1
};

function filterChapterPage(err, res, body) {
    var href = '';
    if (err) {
        if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
            return 'ETIMEOUT';
        } else {
            return false;
        }
    }
    if (res.statusCode != '200') {
        return false;
    }
    if (!body || (typeof body != 'string' && !Buffer.isBuffer(body))) {
        return false;
    }
    body = Buffer.isBuffer(body) ? body.toString() : body;
    href = res.request.uri.href;
    var $ = cheerio.load(body);
    var obj = {};
    obj.paragraphs = [];
    obj.title = $('.text-head')
        .find('.j_chapterName')
        .text()
        .trim();
    $('.read-content')
        .find('p')
        .each(function() {
            obj.paragraphs.push(
                $(this)
                    .text()
                    .trim()
            );
        });
    return obj;
}

function getMore() {
    Novel.find(query, config).then(function(novels) {
        var Count = novels.length;
        if (Count == 0) {
            console.log(`没有需要爬去章节的小说!`);
            console.log(`all chapters of all novel save ok!3 seconds close database!`);
            setTimeout(function() {
                mongoose.close();
            }, 3000);
            return;
        }
        // novels.reverse()
        console.log(`总共 \x1B[34m ${Count}\x1B[39m本小说需要爬去章节`);
        Novel.findOne({ _id: novels.shift()._id }).then(function circle(_novel) {
            console.log('-------------------------------------');
            console.log(`拿到小说 \x1B[34m ${_novel.title}\x1B[39m 的信息`);
            var chapter_hrefs = _novel.chapters.filter(function(item, index) {
                return typeof item == 'object' && !item.chapter_id;
            });
            chapter_hrefs = chapter_hrefs.map(function(item) {
                return item.href;
            });
            console.log(`初步分析还需要${chapter_hrefs.length}章节,update 语句加速更新`);
            var flag = chapter_hrefs.length;
            function chapterReqCb(err, res, body) {
                flag--;
                if (flag == 0) {
                    console.log(`\x1B[34m ${_novel.title}\x1B[39m all chpaters save ok`);
                    Count--;
                    if (Count == 0) {
                        console.log(`all chapters of all novel save ok!3 seconds close database!`);
                        setTimeout(function() {
                            mongoose.close();
                        }, 3000);
                    } else {
                        Novel.findOne({ _id: novels.shift()._id }).then(circle);
                    }
                }
                var chapterObj = filterChapterPage.call(this, err, res, body);
                if (typeof chapterObj == 'object') {
                    chapterObj.href = this.uri.href;
                    chapterObj.novel_id = _novel._id;
                    _chapter = new Chapter(chapterObj);
                    var obj = Object.assign({}, _chapter._doc);
                    //console.log(obj)
                    delete obj._id;
                    Chapter.update({ novel_id: _novel._id, href: obj.href }, obj, { upsert: true, multi: false });
                } else {
                    console.log(`${this.uri.href} ${chapterObj || 'error'}`);
                }
            }
            chapter_hrefs.forEach(function(href) {
                req(href, chapterReqCb);
            });
        });
    });
}
function updateNovelInDB() {
    Novel.find(query, config).then(function(novels) {
        var Count = novels.length;
        if (Count == 0) {
            console.log(`没有需要更新的小说!`);
            console.log(`all novel is updated!3 seconds close database!`);
            setTimeout(function() {
                mongoose.close();
            }, 3000);
            return;
        }
        // novels.reverse()
        console.log(`总共${Count}本小说需要更新章节的信息`);
        Novel.findOne({ _id: novels.shift()._id }).then(function circle(_novel) {
            var chapter_hrefs = _novel.chapters.filter(function(item, index) {
                return typeof item == 'object' && !item.chapter_id;
            });
            chapter_hrefs = chapter_hrefs.map(function(item) {
                return item.href;
            });
            console.log('----------------------------------');
            console.log(`\x1B[34m ${_novel.title}\x1B[39m准备开始更新,${chapter_hrefs.length}/${_novel.chapters.length}章节需要对比`);
            Chapter.find({ novel_id: _novel._id, href: { $in: chapter_hrefs } }, { href: 1 }).then(function(chapters) {
                if (chapters.length == 0) {
                    Count--;
                    console.log(`\x1B[34m ${_novel.title}\x1B[39m has no chapters in db!`);
                    console.log(`stop update novel message!3 seconds start get more chapters`);
                    // mongoose.close()
                    // return
                    setTimeout(function() {
                        getMore();
                    }, 3000);
                    return;
                }
                var firstDate = new Date();
                var items = _novel.chapters.filter(function(item) {
                    return typeof item == 'object' && !item.chapter_id;
                });
                console.log(`还需要${items.length}章小说的id，现有了${chapters.length}章小说id,开始跟新`);
                chapters.forEach(function(chapter) {
                    items.forEach(function(item, index) {
                        if (item.href == chapter.href) {
                            item.chapter_id = chapter._id;
                        }
                    });
                });
                _novel.save(function(err, result) {
                    Count--;
                    console.log(`\x1B[34m ${_novel.title}\x1B[39m update!`);
                    if (Count == 0) {
                        console.log(`all novels update ok! 3 seconds close database!`);
                        setTimeout(function() {
                            mongoose.close();
                        }, 3000);
                        return;
                    }
                    Novel.findOne({ _id: novels.shift()._id }).then(circle);
                });
                console.log(`更新小说:\x1B[34m ${_novel.title}\x1B[39m的章节信息花费时间 ${new Date() - firstDate}ms`);
            });
        });
    });
}

const argv = process.argv.slice(2);

if (argv.indexOf('--getmore') > -1) {
    mongoose.connect(function() {
        console.log('开始分析小说爬去章节');
        getMore();
    });
} else if (argv.indexOf('--update') > -1) {
    mongoose.connect(function() {
        console.log('开始分析小说更新章节信息');
        updateNovelInDB();
    });
} else {
    console.log(
        'if you want get chapters which need to get, you can do script --getmore,else if you want update the novels in db,you can do script --update'
    );
}
