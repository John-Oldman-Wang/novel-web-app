var req = Symbol('request')
var u = Symbol('requestUrl')
var s = Symbol('successCallBack')
var e = Symbol('errorCallBack')
var m = Symbol('method')
class request {
    constructor(url, successcb, errcb) {
        var xhr = new XMLHttpRequest()
        this[req] = xhr
        this[s] = successcb || null
        this[e] = errcb || null
        this[u] = url
        url && xhr.open('GET', url, true)
        xhr.addEventListener('error',(e)=>{
            console.log(`${this[m]} this ${this[u]} error!`)
        })
        xhr.onreadystatechange = (...arg) => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var self = this
                var e = arg[0]
                var result=null;
                try {
                    result = JSON.parse(self[req]['response']) || JSON.parse(self[req]['responseText'])
                } catch (error) {
                    result = self[req]['response'] || self[req]['responseText']
                }
                if(!("Proxy" in window)){
                    var obj=Object.assign({},e,{
                        'target':self,
                        'srcElement':self,
                        'response': result,
                        "responseText": result
                    })   
                    arg[0] = obj             
                }else{
                    var proxy = new Proxy(e, {
                        get: function (target, name) {
                            if (name == 'target' || name == 'srcElement') {
                                return self
                            } else if (['response', 'responseText'].indexOf(name) > -1) {
                                try {
                                    return JSON.parse(self[req][name])
                                } catch (error) {
                                    return self[req][name]
                                }
                            }
                        }
                    })
                    arg[0] = proxy
                }
                this[s] && this[s].apply(this, arg)
            }
        }
        xhr.onerror = (...args) => {
            this[e] && this[e].apply(this, args)
        }
        xhr.onprogress = (...args) => {
            var e=args[0]
            var cLength=this.getResponseHeader('content-length')
        }
    }
    open(url, cb) {
        var xhr = this[req]
        xhr.open.call(xhr, this[m] || 'GET', this[u] || url, true)
        xhr.setRequestHeader('x-response-type', 'multipart')
    }
    get(url, cb, er) {
        this[u] = url
        this[m] = 'GET'
        this[s] = cb || this[s]
        this[e] = er || this[e]
        return this
    }
    post(url, cb, er) {
        this[u] = url
        this[s] = cb || this[s]
        this[e] = er || this[e]
        this[m] = 'POST'
        return this
    }
    abort() {
        this[req].abort()
    }
    send(...arg) {
        this.abort()
        this.open()
        this[req].send.apply(this[req],arg)
    }
    set url(value) {
        this[u] = value
    }
    set method(value) {
        if (typeof value !== 'string') {
            return
        }
        var methods = ['GET', 'POST', 'DELETE', 'HEAD', 'PUT', 'OPTIONS']
        var method = value.toLocaleUpperCase()
        if (methods.indexOf(method) == -1) {
            return
        }
        this[m] = method
    }
    getResponseHeader() {
        var xhr = this[req]
        if (arguments[0] == undefined) {
            return null
        }
        return xhr.getResponseHeader(...arguments)
    }
    getAllResponseHeaders() {
        var xhr = this[req]
        return xhr.getAllResponseHeaders()
    }
    toString() {
        return this[req].toString()
    }
}
module.exports= request
