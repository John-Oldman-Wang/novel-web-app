(function (this, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.request = factory());
})(window, function () {
    function f(url, successcb, errcb) {
        var xhr = new XMLHttpRequest()
        var scb = successcb
        var ecb = errcb
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                //scb && scb(xhr.responseText)
                scb && scb.apply(this,arguments)
            } else { 
                ecb && ecb.apply(this, arguments)
            }
        }
        xhr.get = function (url, fn1, fn2) {
            xhr.abort()
            xhr.open('GET', url, true)
            scb = fn1
            ecb = fn2
        }
        xhr.post=function(url,formdata,fn1,fn2){
            //need more work
        }
        var f=function(){}
        f.status='pendding'
        f.status='success'
        f.status='error'
        return f

    }
    return f
})