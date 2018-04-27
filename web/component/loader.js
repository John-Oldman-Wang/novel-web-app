import React, { Component } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import "babel-polyfill";

const pages = {
    Index: import('../pages/index.jsx'),
    // Search: import('./search.js'),
    Novel: import('../pages/novel.jsx'),
    // Chapter: import('./chapter.js')
}

module.exports = function (url) {
    return class extends Component {
        constructor() {
            super()
            var promise = pages[url]
            if (typeof promise == 'object') {
                this.state = {
                    Component: '',
                    status: 'pendding'
                }
                promise.then((page) => {
                    pages[url] = page[url]
                    this.setState({
                        Component: page[url],
                        status: 'ok'
                    })
                }).catch(function (err) {
                    console.log(err)
                })
            } else if (typeof promise == 'function') {
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
                this.state.status == 'pendding' ? <div style={{
                    textAlign: 'center',
                    paddingTop: '120px',
                    margin: `0 auto`
                }}>
                    <CircularProgress size={60} thickness={3} />
                    <p>正在加载</p></div> : <C {...props} />

            );
        }
    }
}