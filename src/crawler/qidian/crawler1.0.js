//第三方模块引入
const cheerio = require('cheerio');
const request = require('request');
const http = require('http');
const url = require('url');
const iconv = require('iconv-lite');
const mongoose = require('mongoose');
const _ = require('underscore');

// 自定义模块和model引入
var Novel = require('../config/models/m-novel.js');
var req = require('./httpget.js');

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
//

var origin = 'https://www.qidian.com';
var path = '/finish';
var search = '?action=hidden&orderId=&vip=0&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=2&page=';
var novelList_urls = [];
var interval = 0;
var novelMessage_urls = [];
var async = require('./async.js');

//小说列表展示页，筛选出小说信息页的url
function filterNovelListPage(err, res, body) {
    if (err) {
        console.log('request wrong', err.code);
        if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
            console.log(`get ${this.uri.href} timeout`);
            novelList_urls.unshift(this.uri.href);
        }
        return;
    }
    var href = '';

    if (!body || (typeof body != 'string' && !Buffer.isBuffer(body))) {
        console.log('no body');
        return {};
    }
    body = Buffer.isBuffer(body) ? body.toString() : body;
    href = res.request.uri.href;
    var $ = cheerio.load(body);
    if ($('.all-img-list').find('h4').length < 1) {
        return {};
    }
    $('.all-img-list')
        .find('h4')
        .each(function(i, elem) {
            var item = url.resolve(
                href,
                $(this)
                    .find('a')
                    .attr('href')
            );
            novelMessage_urls.push(item);
        });
}
//小说信息页，筛选出小说基本信息，标题，等等

//https://book.qidian.com/ajax/book/category?_csrfToken=p6fgbWEiGCIZIiBI7fiacujAPNjJW3PBxNV3Pogr&bookId=1316859
//p6fgbWEiGCIZIiBI7fiacujAPNjJW3PBxNV3Pogr
//Eg9T233yTQEa1smS2Dqs6np7kwG8sNgr47AWP61F
// SB3A0L5JCXjyhGwoim8V4vHEVoXTL06Af7ZHcJt1   2017-12-2

function reqForNovel(u, cb) {
    var bookid = u.replace(/^[^\r\n\d]*(\d+)/, '$1');
    request(u, { timeout: 5000 }, function(err, res, body) {
        if (err) {
            if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
                console.log(`get ${u} timeout`);
                novelMessage_urls.unshift(u);
            } else {
                console.log('request wrong', err.code);
            }
            cb && cb(false);
            return {};
        }
        if (res.statusCode != '200') {
            console.log(`此页面无小说信息:${this.uri.href}`);
            cb && cb(false);
            return {};
        }
        if (!body || (typeof body != 'string' && !Buffer.isBuffer(body))) {
            console.log('no body');
            cb && cb(false);
            return {};
        }
        var Body = Buffer.isBuffer(body) ? body.toString() : body;
        var href = res.request.uri.href;
        request(
            {
                url: 'https://book.qidian.com/ajax/book/category?_csrfToken=SB3A0L5JCXjyhGwoim8V4vHEVoXTL06Af7ZHcJt1&bookId=' + bookid,
                timeout: 5000,
                headers: {
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6',
                    Connection: 'keep-alive',
                    Host: 'book.qidian.com',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
                }
            },
            function(err, res, body) {
                if (err) {
                    if (err.code == 'ESOCKETTIMEDOUT' || err.code == 'ETIMEDOUT') {
                        console.log(`get ${this.uri.href} chapters timeout`);
                        novelMessage_urls.unshift(u);
                    } else {
                        console.log('get chapters request wrong', err.code);
                    }
                    cb && cb(false);
                    return {};
                }
                if (res.statusCode != '200') {
                    console.log(`此页面无chapters信息:${this.uri.href}`);
                    cb && cb(false);
                    return {};
                }
                if (!body || (typeof body != 'string' && !Buffer.isBuffer(body))) {
                    console.log('no body');
                    cb && cb(false);
                    return {};
                }
                var json = JSON.parse(Buffer.isBuffer(body) ? body.toString() : body);
                if (!'data' in json || typeof json.data != 'object' || !'vs' in json.data) {
                    console.log(`${u} check request headers`);
                    mongoose.close();
                }
                var arr = json.data.vs;
                cb && cb(href, Body, arr);
            }
        );
    });
}
function saveNovel(href, body, arr) {
    if (!href) {
        return;
    }
    var $ = cheerio.load(body);
    var obj = {};
    obj.chapters = [];
    obj.title = $('.book-info')
        .find('h1')
        .find('em')
        .text()
        .trim();
    if (obj.title == '') {
        console.log(`此页面无小说信息:${this.uri.href}`);
        return;
    }
    obj.href = href;
    var n = $('.book-info')
        .find('.intro')
        .next()
        .find('em')
        .eq(1)
        .text();
    var w =
        $('.book-info')
            .find('.intro')
            .next()
            .find('em')
            .eq(1)
            .next()
            .text()
            .indexOf('万总点击') > -1
            ? 10000
            : 1;
    obj.heat = Math.round(parseFloat(n) * w);
    obj.author = $('.book-info')
        .find('h1')
        .find('a')
        .text()
        .trim();
    obj.category = '';
    $('.book-info')
        .find('.red')
        .each(function(index, ele) {
            obj.category += index == 0 ? $(this).text() : '-' + $(this).text();
        });
    obj.shortintroduction = $('.intro')
        .text()
        .trim();
    obj.introduction = $('.book-intro')
        .find('p')
        .text()
        .trim()
        .replace(/\s/g, '\n');
    var time = $('.update')
        .find('.time')
        .text();
    time = time.replace('更新', '');
    var now = new Date();
    if (time.indexOf('昨日') > -1) {
        now.setDate(now.getDate() - 1);
    }
    time = time.replace('今天', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ');
    time = time.replace('昨日', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ');
    obj.lastUpdateTime = new Date(time);
    obj.year = obj.lastUpdateTime.getFullYear();
    obj.image = url.resolve(
        href,
        $('.book-img')
            .find('img')
            .attr('src')
            .trim()
    );
    arr.forEach((item) => {
        if (item.vN.indexOf('作品相关') == -1) {
            item.cs.forEach(function(chapter, index) {
                //检查是不是作者写的通知之类的短文字告知读者的信息
                if (chapter.cnt - 0 < 30) {
                    return;
                }
                var c = {};
                var title = chapter.cN;
                c.href = 'https://read.qidian.com/chapter/' + chapter.cU;
                if (/^第[十|百|千|万|一|二|三|四|五|六|七|八|九|零|\d]+章/g.test(title)) {
                    c.serialName = title.replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/, '$1');
                    c.title = title
                        .replace(/^(第[十|百|千|一|二|三|四|五|六|七|八|九|零|\d]+章)([^/r/n]+)/, '$2')
                        .trim()
                        .replace(c.serialName, '')
                        .replace(/^(:|：)/, '')
                        .trim();
                    c.href = 'https://read.qidian.com/chapter/' + chapter.cU;
                } else if (
                    parseInt(title.replace(/^[^\d]*(\d*).*/, '$1')) == index + 1 ||
                    parseInt(title.replace(/^[^\d]*(\d*).*/, '$1')) == index
                ) {
                    var serial = title.replace(/^[^\d]*(\d*).*/, '$1');
                    c.serial = parseInt(serial) + '';
                    c.serialName = serial;
                    c.title = title
                        .replace(serial, '')
                        .replace(/【|】|(第章)/g, '')
                        .replace(/^章/, '')
                        .replace(/^(:|：)/, '')
                        .trim();
                } else {
                    c.title = title.trim();
                    c.serial = index + 1 + '';
                    c.serialName = c.serial;
                }
                obj.chapters.push(c);
            });
        }
    });
    Novel.find({ title: obj.title, href: obj.href }).exec(function(err, novels) {
        var _novel;
        if (err) {
            console.log('err:', err);
            console.log('查找数据库是否有刚爬到的小说时放生错误');
            mongoose.close();
            return;
        } else if (!novels || !novels.length) {
            _novel = new Novel(obj);
        } else {
            if (novels[0].chapters.length == obj.chapters.length && obj.lastUpdateTime.getTime() == novels[0].lastUpdateTime.getTime()) {
                console.log(`和数据小说信息一样，章节长度一样 ${obj.title}`);
                //return
            }
            //爬去到的信息覆盖数据库的信息
            for (var i = 0; i < novels[0].chapters.length; i++) {
                for (var j = 0; j < obj.chapters.length; j++) {
                    if (novels[0].chapters[i].href == obj.chapters[j].href) {
                        obj.chapters[j] = _.extend(novels[0].chapters[i], obj.chapters[j]);
                        break;
                    }
                }
            }
            _novel = _.extend(novels[0], obj);
        }
        var flag = _novel.isNew;
        _novel.save(function(err, novel) {
            if (err) {
                console.log(`${_novel.title} save err`, err);
            } else {
                console.log(!flag ? '有此小说，更新此小说' : '无此小说，保存此小说', `${novel.title} save ok`);
            }
        });
    });
}
function crawlerNewNovels() {
    mongoose.connect();
    for (var i = 1; i < 1000; i++) {
        novelList_urls.push(origin + path + search + i);
    }
    async(novelList_urls, req, filterNovelListPage, function() {
        console.log(`get all of the list page of novels `);
    });
    function f() {
        setTimeout((e) => {
            if (novelMessage_urls.length > 0) {
                async(novelMessage_urls, reqForNovel, saveNovel, function() {
                    console.log('3 second close database');
                    setTimeout(() => {
                        mongoose.close();
                    }, 3000);
                });
            } else {
                f();
            }
        }, 300);
    }
    f();
}

function updateNovelInDB() {
    mongoose.connect();
    Novel.find({}, { title: 1, href: 1 }).exec(function(err, novels) {
        if (err) {
            console.log(err);
            return;
        }
        novels.forEach((item) => {
            novelMessage_urls.push(item.href);
        });
        console.log(novels.length);
        async(novelMessage_urls, reqForNovel, saveNovel, function() {
            console.log('3 second close database');
            setTimeout(() => {
                mongoose.close();
            }, 3000);
        });
    });
}

const argv = process.argv.slice(2);

if (argv.indexOf('--getnew') > -1) {
    crawlerNewNovels();
} else if (argv.indexOf('--update') > -1) {
    updateNovelInDB();
} else {
    console.log(
        'if you want get new novels, you can do script --getnew,else if you want update the novels in db,you can do script --update'
    );
}
