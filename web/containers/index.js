import Index from '../pages/index.jsx'
import { connect } from 'react-redux'

import fetch from '../plugin/fetch-localforage'

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
                fetch('/index?pbj=1',{
                    method: "GET",
                    headers: {
                        'x-response-type': 'multipart'
                    }
                }).then(json=>{
                    dispatch({
                        type: 'FETCH_NOVELS_SUCCESS',
                        data: json.novels||[]
                    })
                }).catch(()=>{
                    dispatch({
                        type: 'FETCH_NOVELS_ERROR',
                        data: new Error('this response is null')
                    })
                })
            }
        })(dispatch)
    }
}
exports.Index = connect(mapStateToProps, mapDispatchToProps)(Index)