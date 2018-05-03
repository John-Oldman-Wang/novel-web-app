import React from 'react'
import Chapter from '../pages/chapter.jsx'

import request from '../plugin/request'
import { cipher, decipher } from '../plugin/cryptoBro.js'
var xhr = new request()

import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
    var novelChapter = state.novelChapter
    if (novelChapter.novel.title && novelChapter.chapter.title) {
        var chapters = novelChapter.novel.chapters
        var chapter = novelChapter.chapter
        for (var i = 0; i < chapters.length; i++) {
            if(chapter._id == chapters[i].chapter_id){
                return Object.assign({}, { novelChapter: state.novelChapter }, { index: i })
                break;
            }
        }
        // novel.forEach((item,index) => {
        //     if()
        // });
    }
    return { novelChapter: state.novelChapter }
}
const mapDispatchToProps = (dispatch, props) => {
    xhr.get(`/chapter${props.location.search.replace(/\&pbj=1/g, '')}&pbj=1`, (e) => {
        var json = JSON.parse(decipher(e.responseText))
        if (json == null) {
            return
        }
        dispatch({
            type: `complete_chapter`,
            chapter: json
        })
        xhr.get(`/novel?v=${json.novel_id}&pbj=1`, (e) => {
            var json = JSON.parse(decipher(e.responseText))
            if (json == null) {
                return
            }
            // dispatch({
            //     type: `complete_novel`,
            //     novel: json
            // })
            dispatch({
                type: `complete_novelchapter`,
                novel: json
            })
        }).send()
    }).send()
    return {}
}
exports.Chapter = connect(mapStateToProps, mapDispatchToProps)(Chapter)