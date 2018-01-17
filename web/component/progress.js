import React, { Component } from 'react'
import { ProgressBar } from 'react-materialize'
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
        console.log('pro componentDidMount')
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
            <div className="progress lighten-5" style={{ margin: '0px', display: this.state.show ? 'block' : 'none'}}>
                <div className="indeterminate"
                    style={{
                        width: this.state.pro * 100 + "%",
                    }}
                ></div>
            </div>
            // <ProgressBar style={{margin: '0px'}} progress={70}/>
            // <div
            //     style={{width:"100%",display:"block"}}
            // >
            //     <div
            //         style={{
            //             height:this.state.height,
            //             width: this.state.pro*100 +"%",
            //             backgroundColor:this.state.color,
            //             transition:this.state.show?'all 0.5s ease-in':'none',
            //             display: this.state.show ?'block':'none'
            //         }}
            //     >
            //     </div>
            // </div>
        );
    }
}
module.exports = Progrees