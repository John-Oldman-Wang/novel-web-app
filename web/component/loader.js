import React, { Component } from 'react'
// import CircularProgress from 'material-ui/CircularProgress';
// console.log(CircularProgress)



// import "babel-polyfill";
const pages = {
    Index: import('./index.js'),
    Search: import('./search.js'),
    Novel: import('./novel.js'),
    Chapter: import('./chapter.js')
    // Index: import('./index.js')
    // Index: import('./index.js')
}

module.exports = function (url) {
    return class extends Component {
        constructor() {
            super()
            var promise = pages[url]
            if (promise.constructor.name.indexOf('Promise')>-1){
                this.state = {
                    Component: '',
                    status: 'pendding'
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
            }else{
                this.state = {
                    Component: pages[url],
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