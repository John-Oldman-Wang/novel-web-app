import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Switch, Redirect, BrowserRouter, Route } from 'react-router-dom'

import Loader from './component/loader.js'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
const store = createStore(rootReducer)

window.s=store
ReactDom.render(<Provider store={store}>
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Loader('Index')}></Route>
            <Route path='/novel' component={Loader('Novel')}></Route>
            <Route path='/search' component={Loader('Search')}></Route>
            <Route path='/chapter' component={Loader('Chapter')}></Route>
            <Redirect from="/*" to="/" />
        </Switch>
    </BrowserRouter>
</Provider>, document.getElementById('root'))