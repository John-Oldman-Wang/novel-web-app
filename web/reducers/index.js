import { combineReducers } from 'redux'

function index(state = {
    items: [],
    loading: false,
    error: null
}, action) {
    switch (action.type) {
        case 'FETCH_NOVELS_BEGIN':
            return Object.assign({}, state, {
                loading: true,
                error: null
            });
        case 'FETCH_NOVELS_SUCCESS':
            return Object.assign({}, state, {
                loading: false,
                items: action.data
            });
        case 'FETCH_NOVELS_ERROR':
            return Object.assign({}, state, {
                loading: false,
                error: action.data,
                items: []
            })
        default:
            return state;
    }
}

function novel(state = {
    item: {},
    loading: false,
    error: null
}, action) {
    switch (action.type) {
        case 'SET_NOVEL':
            if (action.data._id == state.item._id) {
                return Object.assign({}, state, { item: Object.assign({}, state.item, action.data), error: null })
            } else {
                return Object.assign({}, state, { item: action.data, error: null })
            }
        case 'FETCH_NOVEL_BEGIN':
            return Object.assign({}, state, {
                loading: true,
                error: null
            });
        case 'FETCH_NOVEL_SUCCESS':
            return Object.assign({}, state, {
                loading: false,
                item: action.data
            });
        case 'FETCH_NOVEL_ERROR':
            return Object.assign({}, state, {
                loading: false,
                error: action.data,
                item: {}
            })
        default:
            return state;
    }
}
function chapter(state = {
    item: {},
    loading: false,
    error: null
}, action) {
    switch (action.type) {
        case "SET_CHAPTER":
            return Object.assign({}, state, { item: action.data })
        case "FETCH_CHAPTER_BEGIN":
            return Object.assign({}, state, {
                loading: true,
                error: null
            })
        case "FETCH_CHAPTER_SUCCESS":
            return Object.assign({}, state, {
                loading: false,
                item: action.data
            })
        case "FETCH_CHAPTER_ERROR":
            return Object.assign({}, state, {
                loading: false,
                error: action.data,
                item: {}
            })
        default:
            return state;
    }
}
export default combineReducers({
    // user,
    index,
    novel,
    chapter
})