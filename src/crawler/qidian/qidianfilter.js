const cheerio = require('cheerio');
module.exports = {
    //待 试运行
    filterNovelListPage: function(res) {
        var body = res.buffer.toString();
        var href = '';
        body = Buffer.isBuffer(body) ? body.toString() : body;
        href = res.request.uri.href;
        var $ = cheerio.load(body);
        var urls = [];
        if ($('.all-img-list').find('h4').length < 1) {
            return [];
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
                urls.push(item);
            });
    },
    filterMesOfNovels: function(res, json) {
        var href = res.request.uri.href;
        var body = res.buffer.toString();
        var $ = cheerio.load(body);
        var obj = {};
        obj.title = $('.book-info')
            .find('h1')
            .find('em')
            .text()
            .trim();
        obj.href = href;
        obj.chapters = [];
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
            time = time.replace('昨日', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ');
        } else {
            time = time.replace('今天', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ');
        }
        obj.lastUpdateTime = new Date(time);
        obj.year = obj.lastUpdateTime.getFullYear();
        obj.image = url.resolve(
            href,
            $('.book-img')
                .find('img')
                .attr('src')
                .trim()
        );
        json.data.vs.forEach((item) => {
            if (item.vN.indexOf('作品相关') == -1) {
                item.cs.forEach(function(chapter, index) {
                    if (chapter.cnt - 0 < 30) {
                        return;
                    }
                    var c = {};
                    c.title = chapter.cN;
                    c.href = 'https://read.qidian.com/chapter/' + chapter.cU;
                    obj.chapters.push(c);
                });
            }
        });
        return obj;
    },
    filterMesOfChapter: function(res) {
        var body = res.buffer.toString();
        var href = res.request.uri.href;
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
};
