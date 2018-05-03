import React from 'react'
import Novel from '../pages/novel.jsx'

import request from '../plugin/request'
import { cipher, decipher } from '../plugin/cryptoBro.js'
var xhr = new request()

import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
    return ({ novel: state.novel })
}
const mapDispatchToProps = (dispatch, props) => {
    if(props.novel&&props.novel._id){
        xhr.get(`/novel?v=${props.novel._id}&pbj=1`, (e) => {
            var json = JSON.parse(decipher(e.responseText))
            if (json == null) {
                return
            }
            dispatch({
                type: `complete_novel`,
                novel: json
            })
        }).send()
    }else{
        xhr.get(`/novel${props.location.search}&pbj=1`, (e) => {
            var json = JSON.parse(decipher(e.responseText))
            if (json == null) {
                return
            }
            dispatch({
                type: `complete_novel`,
                novel: json
            })
        }).send()
    }
    
    return {
        dispatch: (chapter,novel) => {
            dispatch({
                type: 'focus_chapter',
                chapter,
                novel
            })
        }
    }
}
exports.Novel = connect(mapStateToProps, mapDispatchToProps)(Novel)