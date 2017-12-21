const React = require('react');
const Component=React.Component
const ReactDom=require('react-dom')

const { Switch, Redirect ,BrowserRouter, Route, Link } = require('react-router-dom') 
window.a=require('react-router-dom')
console.log( a )


const Index=require('./component/index.js')
const About=require('./component/about.js')
const Novel=require('./component/novel.js')
const Chapter=require('./component/chapter.js')
const Search=require('./component/search.js')
const Progress=require('./component/progress.js')
class App extends Component{
    render(){
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
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
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

window.p1 = ReactDom.render(<Progress pro={0} ></Progress>, document.getElementById("progressBar"))
ReactDom.render(<BrowserRouter>
    <App>
        <Switch>
            <Route exact path='/' component={Index}></Route>
            <Route path='/novel' component={Novel}></Route>
            <Route path='/search' component={Search}></Route>
            <Route path='/chapter' component={Chapter}></Route>
            <Redirect from="/*" to="/" />
        </Switch>
    </App>
</BrowserRouter>, document.getElementById('content'))