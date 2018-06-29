import React, { PureComponent } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
// import "babel-polyfill";

const pages = {
    Index: function(){ return import(/* webpackChunkName: 'Index' */'./containers/index.js')},
    Novel: function(){ return import(/* webpackChunkName: 'Novel' */'./containers/novel.js')},
    Chapter: function(){ return import(/* webpackChunkName: 'Chapter' */'./containers/chapter.js')},
    SignUp: function(){ return import(/* webpackChunkName: 'SignUp' */'./containers/signUp.js')},
    Search: function(){ return import(/* webpackChunkName: 'Search' */'./containers/search.js')},
    // Index: import('./index.js'),
    // Novel: import('./novel.js'),
    // Chapter: import('./chapter.js'),
}

module.exports = function (url) {
    return class extends PureComponent {
        constructor() {
            super()
            var promise = pages[url]()
            promise.then((page) => {
                const C=page[url]
                this.render=function(){
                    return <C {...this.props} />
                }
                this.setState({})
            }).catch(function (err) {
                console.log(err)
            })
            this.render=function(){
                return <div style={{
                    textAlign: 'center',
                    paddingTop: '120px',
                    margin: `0 auto`
                }}>
                    <CircularProgress size={60} thickness={3} />
                </div>
            }
        }
        render() {
            return (
                <div style={{
                    textAlign: 'center',
                    paddingTop: '120px',
                    margin: `0 auto`
                }}>
                    <CircularProgress size={60} thickness={3} />
                </div> 
            );
        }
    }
}