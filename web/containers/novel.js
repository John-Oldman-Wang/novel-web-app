import React from 'react'
import Novel from '../pages/novel.jsx'

import request from '../plugin/request'
import { cipher, decipher } from '../plugin/cryptoBro.js'
var xhr = new request()

import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
    return state.novel
}
const mapDispatchToProps = (dispatch, props) => {
    return (function (dispatch) {
        return {
            getNovel: function(novel_id){
                dispatch({
                    type: 'FETCH_NOVEL_BEGIN'
                })
                xhr.get(`/novel?v=${novel_id}&pbj=1`, (e) => {
                    var res = decipher(e.responseText)
                    var json = JSON.parse(res)
                    // console.log(res==null)
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
            setNovel:function(novel){
                dispatch({
                    type: `SET_NOVEL`,
                    data: novel
                })
            },
            // init: function(){
            //    dispatch({
            //         type: `INIT_NOVEL`,
            //         data: novel
            //     })
            // },
            dispatch: dispatch
        }
    })(dispatch)
}
exports.Novel = connect(mapStateToProps, mapDispatchToProps)(Novel)