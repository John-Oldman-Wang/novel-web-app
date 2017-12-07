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
        this.state.show=this.state.pro!=1
    }
    goto(value){
        if(value>1){
            value=(value%101)/100
        }
        if(!this.state.show){
            this.setState({
                show:!!1,
                pro:value
            })
        }else{
            this.setState({
                pro:value
            })
        }
        if(value==1){
            setTimeout(() => {
                this.setState({
                    show:false,
                    pro:0
                })
            }, 1000);
        }
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
                        transition:this.state.show?'all 0.5s ease-in':'none',
                        display: this.state.show ?'block':'none'
                    }}
                >
                </div>
            </div>
        );
    }
}
module.exports = Progrees