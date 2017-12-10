console.time('first')
const React = require('react');
const Component=React.Component
const ReactDom=require('react-dom')

const { BrowserRouter, Route, Link } = require('react-router-dom') 

const Index=require('./component/index.js')
const About=require('./component/about.js')
const Novel=require('./component/novel.js')
const Chapter=require('./component/chapter.js')
const Search=require('./component/search.js')
const Progress=require('./component/progress.js')

class App extends Component{
    render(){
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
    componentDidMount() {
        console.timeEnd('first')
    }
}

console.time(new Date())
window.p1 = ReactDom.render(<Progress pro={0} />, document.getElementById("progressBar"))
ReactDom.render(<BrowserRouter>
    <App>
        <Route exact  path='/' component={Index}></Route>
        <Route path='/novel' component={Novel}></Route>
        <Route path='/search' component={Search}></Route>
        <Route path='/chapter' component={Chapter}></Route>
        {/* <Route path='/*' component={About}></Route> */}
    </App>
</BrowserRouter>,document.getElementById('content'))
