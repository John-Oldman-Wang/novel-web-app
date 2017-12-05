const React = require('react');
const { Component } = require('react')
class Progrees extends Component {
    constructor(props) {
        super(props)
        this.state = Object.assign({},{
            color:'#98FB98',
            pro:0.5,
            height:'5px'
        },props)
    }
    goto(value){
        
        if(value>1){
            value=value/100
        }
        this.setState({
            pro:value
        })
    }
    render() {
        return (
            <div
                style={{width:"100%",display:"block"}}
            >
                <div
                    style={{
                        height:this.state.height,
                        width: this.state.pro*100 +"%",
                        backgroundColor:this.state.color,
                        transition:'all 0.5s ease-in-out'
                    }}
                >
                </div>
            </div>
        );
    }
}
module.exports = Progrees