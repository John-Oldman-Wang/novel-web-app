import React, { Component } from 'react'
import { LinearProgress } from 'material-ui/Progress';
var timer
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
    componentDidMount(){
        if(this.state.show){
            timer = setTimeout(()=>{
                this.goto(1)
            },3000)
        }else{
            clearTimeout(timer)
        }
    }
    goto(value){
        if(value>1){
            value=(value%101)/100
        }
        if(!this.state.show){
            this.setState({
                show:!!1
            })
            setTimeout(() => {
                this.setState({
                    pro: value
                }) 
            }, 0);
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
            <div className='progress lighten-5' style={{ margin: '0px', display: this.state.show ? 'block' : 'none'}}>
                <div className='indeterminate'
                    style={{
                        width: this.state.pro * 100 + '%',
                    }}
                ></div>
            </div>
        );
    }
}
module.exports = Progrees