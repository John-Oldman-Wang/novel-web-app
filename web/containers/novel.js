import Novel from '../pages/novel.jsx'

import fetch from '../plugin/fetch-localforage'

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
                fetch(`/novel?v=${novel_id}&pbj=1`).then(json=>{
                    if(json == null){
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
            },
            setNovel:function(novel){
                dispatch({
                    type: `SET_NOVEL`,
                    data: novel
                })
            },
            dispatch: dispatch
        }
    })(dispatch)
}
exports.Novel = connect(mapStateToProps, mapDispatchToProps)(Novel)