import React from 'react'
const Component = React.Component
import ReactDom from 'react-dom'
import { Switch, Redirect, BrowserRouter, Route, Link } from 'react-router-dom'


import Loader from './component/loader.js'
import Progress from './component/progress.js'

class App extends Component {
    render() {
        return (
            <div id="app">
                {this.props.children}
            </div>
        )
    }
    componentDidMount() {
        console.timeEnd('first')
    }
}
if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object')
            }
            var to = Object(target)
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
const AppBarExampleIcon = (props) => (
    <AppBar
        title={<span>HHHH</span>}
    >{props.children}
    </AppBar>
);
window.p1 = ReactDom.render(<Progress pro={0} ></Progress>, document.getElementById("progressBar"))
ReactDom.render(<BrowserRouter>
    <App>
        <Switch>
            <Route exact path='/' component={Loader('Index')}></Route>
            <Route path='/novel' component={Loader('Novel')}></Route>
            <Route path='/search' component={Loader('Search')}></Route>
            <Route path='/chapter' component={Loader('Chapter')}></Route>
            <Redirect from="/*" to="/" />
        </Switch>
    </App>
</BrowserRouter>, document.getElementById('content'))