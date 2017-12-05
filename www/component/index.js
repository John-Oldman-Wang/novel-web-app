const React = require('react');
const { Component } = require('react')
class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            text:"asdas"
        }
    }
    hander(e){
        this.setState({
            text:e.target.value
        })
    }
    render() {
        console.log('render')
        return (
            <div>
                <h1>index</h1>
                <input type="text" value={this.state.text} onChange={(e)=>{this.hander(e)}} />
            </div>
        );
    }
}
module.exports = Index