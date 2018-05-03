import crypto from 'crypto-browserify'
import { key } from '../../server/config/config.js'
window.c = crypto
const decipher = function ( str) {
    var de = crypto.Decipher('aes-256-cbc', key)
    var r = ''
    r += de.update(str, 'hex', 'utf-8')
    r += de.final('utf-8')
    return r
}
const cipher = function cipher( text) {
    var ci = crypto.createCipher('aes-256-cbc', key)
    var r = ''
    r += ci.update(text, 'utf-8', 'hex')
    r += ci.final('hex')
    return r
}
decipher.toString = cipher.toString = function () {
    return `${this.name}() { [native code] }`
}
module.exports = { cipher: cipher, decipher:decipher }