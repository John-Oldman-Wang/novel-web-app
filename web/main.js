import React, { Component } from 'react'
import { render } from 'react-dom'
import { Switch, Redirect, BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
const store = createStore(rootReducer)
import Loader from './load.js'
render(<Provider store={store}>
    <BrowserRouter >
        <Switch>
            <Route exact path='/' onChange={e => {
                console.log(`router update`)
            }} component={Loader('Index')}></Route>
            <Route path='/novel' component={Loader('Novel')}></Route>
            <Route path='/search' component={Loader('Search')}></Route>
            <Route path='/chapter' component={Loader('Chapter')}></Route>
            <Route path='/signup' component={Loader('SignUp')}></Route>
            <Redirect from="/*" to="/" />
        </Switch>
    </BrowserRouter>
</Provider>, document.getElementById('root'))