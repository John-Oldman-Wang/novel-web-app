function deepClone(object) {
    if (typeof object != 'object') {
        return object
    } else {
        var newObj = Array.isArray(object) ? [] : {}
        for (var i in object) {
            newObj[i] = deepClone(object[i])
        }
        return newObj
    }
}

module.exports = deepClone