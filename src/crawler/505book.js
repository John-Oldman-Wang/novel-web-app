const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const url = require('url');
module.exports = {
    filterUrlsOfNovels: function(res) {
        var href = res.request.uri.href;
        var body = iconv.decode(res.buffer, 'gbk');
        var $ = cheerio.load(body);
        var urls = [];
        $('#hotcontent')
            .find('a')
            .each(function(i, item) {
                urls.push(url.resolve(href, $(this).attr('href')));
            });
        return urls;
    },
    filterMesOfNovels: function(res) {
        var href = res.request.uri.href;
        var body = iconv.decode(res.buffer, 'gbk');
        var $ = cheerio.load(body);
        var obj = {};
        obj.title = $('#maininfo')
            .find('h1')
            .text()
            .trim();
        obj.category = $('#bdshare')
            .parent()
            .text()
            .replace(/\s/g, '')
            .replace(/.*\>(.*)\>.*/, '$1');
        obj.author = $('#maininfo')
            .find('h1')
            .next()
            .text()
            .replace(/\s/g, '')
            .replace('作者：', '');
        obj.introduction = $('#intro')
            .text()
            .trim();
        obj.img = url.resolve(
            href,
            $('#fmimg')
                .find('img')
                .attr('src')
                .trim()
        );
        obj.lastUpdateTime = new Date(
            $('#info')
                .find('p')
                .eq(-1)
                .text()
                .replace('最后更新：', '')
        );
        obj.chapters = [];
        $('#list')
            .find('a')
            .each(function(i, item) {
                var c = {};
                c.title = $(item)
                    .text()
                    .trim();
                c.href = url.resolve(href, $(item).attr('href'));
                obj.chapters.push(c);
            });
        return obj;
    },
    filterMesOfChapters: function(res) {
        var href = res.request.uri.href;
        var body = iconv.decode(res.buffer, 'gbk');
        var $ = cheerio.load(body);
        var obj = {};
    }
};
