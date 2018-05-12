import React from 'react'
import Chapter from '../pages/chapter.jsx'

import request from '../plugin/request'
import { cipher, decipher } from '../plugin/cryptoBro.js'
var xhr = new request()

import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
    return { novel: state.novel, chapter: state.chapter }
}
const mapDispatchToProps = (dispatch, props) => {
    return (function(dispatch){
        return {
            getChapter: function(chapter_id){
                dispatch({
                    type: "FETCH_CHAPTER_BEGIN"
                })
                xhr.get(`/chapter?c=${chapter_id}&pbj=1`, (e) => {
                    var json = JSON.parse(decipher(e.responseText))
                    if (json == null) {
                        dispatch({
                            type: "FETCH_CHAPTER_ERROR",
                            data: new Error('have no this chapter!')
                        })
                        return
                    }
                    dispatch({
                        type: `FETCH_CHAPTER_SUCCESS`,
                        data: json
                    })
                }).send()
            },
            getNovel: function (novel_id) {
                dispatch({
                    type: 'FETCH_NOVEL_BEGIN'
                })
                xhr.get(`/novel?v=${novel_id}&pbj=1`, (e) => {
                    var res = decipher(e.responseText)
                    var json = JSON.parse(res)
                    if (json == null) {
                        dispatch({
                            type: 'FETCH_NOVEL_ERROR',
                            data: new Error('have no this novel!')
                        })
                        return
                    }
                    dispatch({
                        type: `FETCH_NOVEL_SUCCESS`,
                        data: json
                    })
                }).send()
            },
        }
    })(dispatch)
    
    return {}
}
exports.Chapter = connect(mapStateToProps, mapDispatchToProps)(Chapter)