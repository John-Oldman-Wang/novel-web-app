import React, { Component } from 'react'
import "babel-polyfill";

const pages = {
    Index: import('./index.js'),
    Search: import('./search.js'),
    Novel: import('./novel.js'),
    Chapter: import('./chapter.js')
}

module.exports =  function (url) {
    return class extends Component {
        constructor() {
            super()
            var promise = pages[url]
            if(typeof promise =='object'){
                this.state = {
                    Component: '',
                    status: 'pendding'
                }
                if(url=='Novel'){
                    console.log("load ",url)
                }
                promise.then((page) => {
                    setTimeout(() => {
                        pages[url]=page[url]
                        this.setState({
                            Component: page[url],
                            status: 'ok'
                        })
                    }, 0);
                }).catch(function (err) {
                    console.log(err)
                })
            }else if(typeof promise == 'function'){
                this.state = {
                    Component: promise,
                    status: 'ok'
                }
            }
        }
        render() {
            var C = this.state.Component
            const props = Object.assign({}, this.props);
            return (
                this.state.status == 'pendding' ? <p size={80} thickness={5} >loading</p> : <C {...props} />
            );
        }
    }
}