import React from 'react'
import Index from '../pages/index.jsx'

import request from '../plugin/request'

import { cipher, decipher } from '../plugin/cryptoBro.js'
var xhr = new request()
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
    return state.index
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        setNovel: (novel) => {
            dispatch({
                type: 'SET_NOVEL',
                data: novel
            })
        },
        getNovels: (function () {
            return function () {
                dispatch({
                    type: 'FETCH_NOVELS_BEGIN',
                })
                xhr.get('/index?pbj=1', (e) => {
                    var res = decipher(e.responseText)
                    if (!res) {
                        dispatch({
                            type: 'FETCH_NOVELS_ERROR',
                            data: new Error('this response is null')
                        })
                        return
                    }
                    var json = JSON.parse(res)
                    console.log(json)
                    dispatch({
                        type: 'FETCH_NOVELS_SUCCESS',
                        data: json.novels
                    })
                }).send()
            }
        })(dispatch)
    }
}
exports.Index = connect(mapStateToProps, mapDispatchToProps)(Index)