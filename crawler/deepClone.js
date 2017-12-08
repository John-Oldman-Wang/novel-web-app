function deepClone(object) {
    var newObj
    if (typeof object != 'object') {
        return object
    } else if(object instanceof Object||object instanceof Array) {
        newObj = Array.isArray(object) ? [] : {}
        for (var i in object) {
            newObj[i] = deepClone(object[i])
        }
        return newObj
    }else if(object instanceof Date){
        newObj=new Date()
        newObj.setTime(object.getTime())
        return newObj
    }else{
        throw new Error('Unable to copy values!Its type isn`t supported!')
    }
}

module.exports = deepClone