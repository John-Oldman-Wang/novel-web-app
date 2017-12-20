module.exports = function (str) {
    var t
    try {
        t = new Date(str);
    } catch (e) {
        throw e;
        return 'no time'
    }
    var year = t.getFullYear(),
        month = ('00' + (t.getMonth() + 1)).substr(-2),
        date = ('00' + t.getDate()).substr(-2),
        hour = ('00' + t.getHours()).substr(-2),
        minute = ('00' + t.getMinutes()).substr(-2),
        second = ('00' + t.getSeconds()).substr(-2)
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`
}