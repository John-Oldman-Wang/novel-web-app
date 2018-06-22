import Index from '../pages/index.jsx'
import request from '../plugin/request'

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
                    var res = e.responseText
                    if (!res) {
                        dispatch({
                            type: 'FETCH_NOVELS_ERROR',
                            data: new Error('this response is null')
                        })
                        return
                    }
                    var json = res
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