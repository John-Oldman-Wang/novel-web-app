import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
const store = createStore(rootReducer)
exports.Provider = Provider
exports.store = store