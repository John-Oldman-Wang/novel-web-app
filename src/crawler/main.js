const fetch = require('./plugin/fetchFiveTimes');
const cheerio = require('cheerio');
const url = require('url');
const mongoose = require('mongoose');
const Novel = require('../server/config/models/m-novel');
const Chapter = require('../server/config/models/m-chapter');

mongoose.Promise = Promise;

const { dbUrl } = require('../server/config/config');

// 小说列表页面的 模板地址

/**
 * @param {Object} args
 * @param {String} args.href 小说列表页面的地址
 * @param {String} args.body 此小说列表内容
 * @returns {String[]}
 */

function filterNovelListPage({ href, body }) {
    body = Buffer.isBuffer(body) ? body.toString() : body;
    var $ = cheerio.load(body);
    const urls = [];
    if ($('.all-img-list').find('h4').length < 1) {
        return urls;
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
    return urls;
}

/**
 * @param {Object} args
 * @param {String} args.href 小说页面地址
 * @param {String} args.body 小说页面内容
 * @param {String} args.json 小说章节的json数据
 * @returns {Obejct}
 */

function filterNovelPage({ href, body, json }) {
    var $ = cheerio.load(body);
    let novel = {};

    // 小说名称
    novel.title = $('.book-info')
        .find('h1')
        .find('em')
        .text()
        .trim();
    if (novel.title == '') {
        return novel;
    }
    // 小说原地址
    novel.href = href;

    // 小说点击量
    var n = $('.book-info')
        .find('.intro')
        .next()
        .find('em')
        .eq(1)
        .find('span')
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
    // 起点 数字使用字体混淆无法获取
    novel.heat = Math.round(parseFloat(n) * w) || 0;

    // 小说作者
    novel.author = $('.book-info')
        .find('h1')
        .find('a')
        .text()
        .trim();

    var state = $('.book-info')
        .find('.blue')
        .eq(0)
        .text()
        .trim();
    novel.state = ['连载', '完本'].includes(state) ? state : '未知';
    // 小说分类
    novel.categorys = [];
    $('.book-info')
        .find('.red')
        .each(function(index, ele) {
            novel.categorys.push($(this).text());
        });
    novel.categorys = [...new Set(novel.categorys)];
    novel.category = $('.book-info')
        .find('.red')
        .eq(0)
        .text();
    novel.smallCategory = $('.book-info')
        .find('.red')
        .eq($('.book-info').find('.red').length > 1 ? 1 : 0)
        .text();
    // 小说简短介绍
    novel.shortintroduction = $('.intro')
        .text()
        .trim();

    // 小说长介绍
    novel.introduction = $('.book-intro')
        .find('p')
        .text()
        .trim()
        .replace(/\s/g, '\n');

    // 小说最后更新时间
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
    novel.lastUpdateTime = new Date(time);

    if (time.indexOf('分钟前') > -1) {
        var t = new Date();
        t.setMinutes(t.getMinutes() - parseInt(time));
        novel.lastUpdateTime = t;
    }
    if (time.indexOf('小时前') > -1) {
        var t = new Date();
        t.setHours(t.getHours() - parseInt(time));
        novel.lastUpdateTime = t;
    }
    if (isNaN(novel.lastUpdateTime.getDate())) {
        novel.lastUpdateTime = new Date(0);
    }
    // 小说年份
    novel.year = novel.lastUpdateTime.getFullYear();
    // 小说图片地址
    novel.image = url.resolve(
        href,
        $('.book-img')
            .find('img')
            .attr('src')
            .trim()
    );
    novel.chapters = [];
    json.data.vs.forEach((item) => {
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
                novel.chapters.push(c);
            });
        }
    });
    return novel;
}

/**
 *
 * @param {String} body 章节页面内容
 * @returns {Object} 小说一章需要包含的信息
 */

function filterChapterPage(body) {
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

/**
 *
 * @param {String} listurl 小说列表页的地址
 * @return {null}
 */
async function crawlerOnelist(listurl) {
    // fetch nove list page
    const listRes = await fetch(listurl);
    console.log(`fetch ${listurl} ok!`);
    const href = listRes.url;
    const body = await listRes.text();
    // filter novel page url
    let novelUrls = filterNovelListPage({
        href,
        body
    });

    // console.log(`小说列表有${novelUrls.length}个小说信息页面的地址!`)
    let inDataBaseNovelUrls = await Novel.find(
        {
            href: {
                $in: novelUrls
            }
        },
        {
            href: 1
        }
    );
    if (inDataBaseNovelUrls.length > 0) {
        inDataBaseNovelUrls = inDataBaseNovelUrls.map((item) => item.href);
        novelUrls = novelUrls.filter((item) => {
            return !inDataBaseNovelUrls.includes(item);
        });
        console.log(`去除数据库已经有的小说还剩下${novelUrls.length}个小说地址`);
    }
    // forEach urls of novel pages get novel massge and chapter page url
    for (let i = 0; i < novelUrls.length; i++) {
        const novelJson = await crawlerOneNovel(novelUrls[i]);

        if (novelJson.chapters.length > 0) {
            let _novel = new Novel(novelJson);
            let novel = await _novel.save();
            console.log(`${novel.title}: ${novel._id} 保存成功`);
        } else {
            console.log(`${novelJson.title}: 无章节不保存`);
        }
    }
    console.log(`循环爬去小说信息结束`);
}

/**
 * @param {String} novelUrl 单个小说地址
 * @return {Object} 一部小说需要包含的信息
 */
async function crawlerOneNovel(novelUrl) {
    //
    const bookid = novelUrl.replace(/^[^\r\n\d]*(\d+)/, '$1');

    const [novelRes, json] = await Promise.all([
        fetch(novelUrl),
        fetch(`https://book.qidian.com/ajax/book/category?_csrfToken=SKHlNkcNlKF1jse9Y2wX0dlX9TILo7LcecsatsDp&bookId=${bookid}`).then(
            (res) => {
                return res.json();
            }
        )
    ]);
    const href = novelRes.url;
    const body = await novelRes.text();
    const novelJson = filterNovelPage({
        href,
        body,
        json
    });
    return novelJson;
}

/**
 *
 * @param {String} chapterUrl 章节页面的地址
 * @returns {Object} 一个章节需要包含的信息
 */
async function crawlerOneChapter(chapterUrl) {
    let chapterContext = await fetch(chapterUrl).then((res) => {
        return res.text();
    });
    return filterChapterPage(chapterContext);
}

/**
 *
 * @param {Number} skip 查询时需要跳过的数目
 */
async function crawlerChapterOfOneNovelInDatabase(skip = 0) {
    // console.log(`skip ${skip}`)
    const novel = await Novel.findOne({
        'chapters.chapter_id': null
    }).skip(skip);
    console.log(`${novel.title} 需要爬去章节`);
    const chapters = novel.chapters;
    const chapterUrls = chapters.map((item) => item.href);
    // 先查数据已经保存的此校说的章节
    const chaptersInDB = await Chapter.find({
        // novel_id: novel._id,
        href: {
            $in: chapterUrls
        }
    });
    console.log(`${novel.title}在数据库里面已经有了${chaptersInDB.length}章节`);
    chaptersInDB.forEach((c) => {
        chapters.forEach((c1) => {
            if (c.href == c1.href) {
                c1.chapter_id = c._id;
            }
        });
    });
    const needFetchChapters = chapters.filter((item) => !item.chapter_id);
    for (let i = 0; i < needFetchChapters.length; i++) {
        let chapterUrl = needFetchChapters[i].href;
        let chapterJson = await crawlerOneChapter(chapterUrl);
        chapterJson.href = chapterUrl;
        chapterJson.novel_id = novel._id;
        let _chapter = new Chapter(chapterJson);
        let chapter = await _chapter.save();
        needFetchChapters[i].chapter_id = chapter._id;
        console.log(`${novel.title} 的 ${chapter.title} 保存到了数据库`);
    }
    await novel.save();
    console.log(`${novel.title} 爬完章节`);
}

async function crawlerChapterOfAllNovelInDatabase() {
    // 爬去 已经在数据库里面 但是 还没有章节 的小说 的章节,更新数据库的 小说的章节信息 并且 保存 章节
    const count = await Novel.count({
        'chapters.chapter_id': null
    });
    console.log(`总共${count}本小说需要爬去章节`);
    var sectionLength = 5;
    var sectionCount = Math.ceil(count / sectionLength);
    console.log(`${sectionLength} * ${sectionCount}`);
    for (var i = 0; i < sectionCount; i++) {
        var pros = [];

        for (j = i * sectionLength; j < i * sectionLength + sectionLength && j < count; j++) {
            pros.push(crawlerChapterOfOneNovelInDatabase(j % 5));
        }
        console.log(`组织${pros.length}个`);
        await Promise.all(pros);
        console.log(`完成 五个`);
    }
}

async function crawlerNewNovel() {
    // 爬去新小说
    const currentUrl = 'https://www.qidian.com/free/all?orderId=&vip=hidden&style=1&pageSize=20&siteid=1&pubflag=0&hiddenField=1&page=';
    const novelListUrl = [];

    for (let i = 0; i < 100; i++) {
        novelListUrl.push(`${currentUrl}${i + 1}`);
    }
    var sectionLength = 5;
    var sectionCount = Math.ceil(novelListUrl.length / sectionLength);
    for (var i = 0; i < sectionCount; i++) {
        var pros = [];
        for (j = i * sectionLength; j < i * sectionLength + sectionLength && j < novelListUrl.length; j++) {
            pros.push(crawlerOnelist(novelListUrl[j]));
        }
        await Promise.all(pros);
    }
}

async function updatgeNovelInDatabase() {
    const count = await Novel.count({
        state: {
            $not: new RegExp('完本')
        }
    });
    console.log(`有${count}本小说需要检查更新`);
    const needUpdateNovels = await Novel.find({
        state: {
            $not: new RegExp('完本')
        }
    }).limit(1);
    for (let _novel of needUpdateNovels) {
        let novelJson = await crawlerOneNovel(_novel.href);
        diffNovel(_novel, novelJson);
        // _novel.chapters.forEach(chapter => {
        //     // console.log(chapter.title)
        // })
        // delete novelJson.chapters;
        // console.log(_novel.title);
        // console.log(novelJson);
    }
}

/**
 *
 * @param {Object} _novel 数据库里面小说文档对象
 * @param {Object} novelJson 重新爬去到的小说对象
 * @returns {Boolean} 是否改变了数据库文档对象的属性
 */
function diffNovel(_novel, novelJson) {
    if (_novel.title != novelJson.title) {
        return false;
    }
    let chaptersJson = novelJson.chapters;
    delete novelJson.chapters;
    Object.assign(_novel, novelJson);

    if (_novel.chapters.length == chaptersJson.length) {
        return true;
    }
    if (_novel.chapters.length > chaptersJson.length) {
        throw new Error(`此小说出错:${_novel.title}`);
    }

    if (_novel.chapters.length < chaptersJson.length) {
        for (let i = 0; i < _novel.chapters.length; i++) {
            if (chaptersJson[i].href != _novel.chapters[i].href) {
                throw new Error(`此小说有问题:${_novel.title}`);
            }
        }
    }
    _novel.chapters = _novel.chapters.concat(chaptersJson.slice(_novel.chapters.length));
    return true;
    // let keys = Obejct.keys(_novel);
    // let needUpdate = false;
    // for (let key in keys) {
    //     if (typeof _novel[key] == 'string' && _novel[key].length < novelJson[key].length) {
    //         needUpdate = true;
    //         break;
    //     }
    //     if (typeof _novel[key] == 'number' && _novel[key] < novelJson[key]) {
    //         needUpdate = true;
    //         break;
    //         return
    //     }
    //     if(typeof _novel[key]=='object'){

    //     }
    // }
}

mongoose
    .connect(
        dbUrl,
        {
            useMongoClient: true
        }
    )
    .then(async function() {
        // 这里是入口
        console.log('=>开始爬');
        // await crawlerNewNovel()

        // await crawlerChapterOfAllNovelInDatabase()

        await updatgeNovelInDatabase();
        console.log('=>爬完了');
        return true;
    })
    .then(() => {
        console.log('关闭数据库');
        mongoose.connection.close();
    })
    .catch((err) => {
        mongoose.connection.close();
        // throw err;
        console.log(`=>main error`, err.message);
    });
