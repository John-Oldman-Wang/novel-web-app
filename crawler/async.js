function async(arr, fn, cb, enddo) {
    if (!Array.isArray(arr)) {
        throw new Error('the first arguments must be array and lenth must over 0!')
        return
    } else if (arr.length == 0) {
        enddo && enddo()
        return
    }
    if (typeof fn != 'function' || typeof cb != 'function') {
        throw new Error(`the ${typeof fn != 'function' ? 'second' : 'third'} arguments must be function!`)
        return
    }
    function circle_function() {
        cb.apply(this, arguments)
        if (arr.length == 0) {
            enddo && enddo()
            return
        }
        fn(arr.shift(), circle_function)
    }
    fn(arr.shift(), circle_function)
}
module.exports=async