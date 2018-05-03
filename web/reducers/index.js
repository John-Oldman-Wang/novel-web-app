import { combineReducers } from 'redux'

function index(state = [], action) {
    switch (action.type) {
        case 'set_index':
            return [...action.data];
        case 'update_Index':
            return state;
        default:
            return state;
    }
}

function novel(state = {}, action) {
    switch (action.type) {
        case 'focus_novel':
            return Object.assign({}, state, action.novel)
        case 'complete_novel':
            if (state._id && state._id != action.novel._id) {
                console.log('return complete_novel')
                return state
            }
            return Object.assign({}, state, action.novel)
        default:
            return state;
    }
}
function novelChapter(state = {
    novel: {},
    chapter: {}
}, action) {
    switch (action.type) {
        case "focus_chapter":
            return Object.assign(state, {
                chapter: Object.assign(action.chapter, { _id: action.chapter.chapter_id }),
                novel: action.novel
            })
        case "complete_chapter":
            return Object.assign({}, state, { chapter: action.chapter });
        case "complete_novelchapter":
            return Object.assign({},state,{novel: action.novel})
        case "next_chapter":
            console.log(`next_chapter`)
            return state;
        case "pre_chapter":
            console.log(`pre_chapter`)
            return state;
        default:
            return state;
    }
}
export default combineReducers({
    // user,
    index,
    novel,
    novelChapter
})