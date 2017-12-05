const React = require('react');
const { Component } = require('react')
const ReactDom=require('react-dom')

const { BrowserRouter, Route, Link } = require('react-router-dom') 

const Index=require('./component/index.js')
const About=require('./component/about.js')
const Progress=require('./component/progress.js')

class App extends Component{
    render(){
        return (
            <div>
                <ul>
                    <Link to='/'>index</Link> 
                    <Link to='/about'>about</Link> 
                </ul>
                {this.props.children}
            </div>
        )
    }
}


ReactDom.render(<BrowserRouter>
    <App>
        <Route exact  path='/' component={Index}></Route>
        <Route path='/about' component={About}></Route>
    </App>
</BrowserRouter>,document.getElementById('content'))

var p1=ReactDom.render(<Progress />,document.getElementById("progressBar"))
var p2=ReactDom.render(<Progress />,document.getElementById("footer"))

setTimeout(() => {
    p1.goto(69)
    console.log(p1==p2)
}, 3000);