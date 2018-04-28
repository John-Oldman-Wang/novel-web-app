import * as React from 'react'
const Component = React.Component
import ReactDom from 'react-dom'
import { Switch, Redirect, BrowserRouter, Route, Link } from 'react-router-dom'

import Loader from './component/loader.js'
import Progress from './component/progress.js'

ReactDom.render(<BrowserRouter>
    <Switch>
        <Route exact path='/' component={Loader('Index')}></Route>
        <Route path='/novel' component={Loader('Novel')}></Route>
        <Route path='/search' component={Loader('Search')}></Route>
        <Route path='/chapter' component={Loader('Chapter')}></Route>
        <Redirect from="/*" to="/" />
    </Switch>
</BrowserRouter>, document.getElementById('root'))