import React from 'react'
import Index from '../pages/index.jsx'

import request from '../plugin/request'

import { cipher, decipher } from '../plugin/cryptoBro.js'
var xhr = new request()
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
    return { data: state.index }
}
const mapDispatchToProps = (dispatch, props) => {
    console.log('get novel list',props.data)
    xhr.get('/index?pbj=1', (e) => {
        var json = JSON.parse(decipher(e.responseText))
        dispatch({
            type: 'set_index',
            data: json.novels
        })
    }).send()
    return {
        dispatch: (novel) => {
            dispatch({
                type: 'focus_novel',
                novel
            })
        }
    }
}
exports.Index = connect(mapStateToProps, mapDispatchToProps)(Index)