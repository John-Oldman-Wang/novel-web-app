import Chapter from '../pages/chapter.jsx'

import fetch from '../plugin/fetch-localforage'
import request from '../plugin/request'
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
                fetch(`/chapter?c=${chapter_id}&pbj=1`).then(json=>{
                    if(json==null){
                        throw new Error('has no chapter')
                    }
                    dispatch({
                        type: `FETCH_CHAPTER_SUCCESS`,
                        data: json
                    })
                }).catch(err=>{
                    dispatch({
                        type: `FETCH_CHAPTER_SUCCESS`,
                        data: err
                    })
                })
                // xhr.get(`/chapter?c=${chapter_id}&pbj=1`, (e) => {
                //     var json = e.responseText
                //     if (json == null) {
                //         dispatch({
                //             type: "FETCH_CHAPTER_ERROR",
                //             data: new Error('have no this chapter!')
                //         })
                //         return
                //     }
                //     dispatch({
                //         type: `FETCH_CHAPTER_SUCCESS`,
                //         data: json
                //     })
                // }).send()
            },
            getNovel: function (novel_id) {
                dispatch({
                    type: 'FETCH_NOVEL_BEGIN'
                })
                fetch(`/novel?v=${novel_id}&pbj=1`).then(json=>{
                    if(json==null){
                        throw new Error('has no novel')
                    }
                    dispatch({
                        type: `FETCH_NOVEL_SUCCESS`,
                        data: json
                    })
                }).catch(err=>{
                    dispatch({
                        type: 'FETCH_NOVEL_ERROR',
                        data: err
                    })
                })
                // xhr.get(`/novel?v=${novel_id}&pbj=1`, (e) => {
                //     var res = e.responseText
                //     var json = res
                //     if (json == null) {
                //         dispatch({
                //             type: 'FETCH_NOVEL_ERROR',
                //             data: new Error('have no this novel!')
                //         })
                //         return
                //     }
                //     dispatch({
                //         type: `FETCH_NOVEL_SUCCESS`,
                //         data: json
                //     })
                // }).send()
            },
        }
    })(dispatch)
}
exports.Chapter = connect(mapStateToProps, mapDispatchToProps)(Chapter)