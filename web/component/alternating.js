import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

const styles ={
    root:{
        width: '100%',
        paddingBottom: '47.128%',
        position: 'relative'
        // backgroundColor: 'red'
    },
    wrap:{
        position: 'absolute',
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
        backgroundColor: 'red'
    },
    rollwrap:{
        position: 'absolute',
        bottom: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        padding: '0px' 
    },
    roll:{
        listStyle: 'none',
        display: 'flex',
        width: '100%',
        padding: '0px 0px 10px',
        margin: '0px',
        justifyContent: 'center',
        //backgroundColor: 'red',
        height: '4%'
    },
    rollList:{
        width: '4%',
        paddingBottom: '4%',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,.2)'
    },
    rollListMargin:{
        margin: '0px 8px 0px 0px'
    },
    focus:{
        backgroundColor: 'rgba(0,0,205,0.6)'
    },
}
class Alternating extends Component{
    constructor(props){
        super(props)
        this.state={
            focus: 1,
            length: props.children?props.children.length||4:4
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        for(var i in this.props.classes){
            if (this.props.classes[i] != nextProps.classes[i]){
                return true
            }
        }
        return this.state != nextState
    }
    render(){
        const { classes, children } = this.props
        console.log('a render')
        return(
            <div
                className={classes.root}
            ><div className={classes.wrap}>
                    {children}
                    <div className={classes.rollwrap}>
                        <ul className={classes.roll}>
                            {(function(t){
                                var arr=[]
                                for(var i=0;i<t.state.length;i++){
                                    var m = (i != (t.state.length - 1))
                                    var f = (i + 1 == t.state.focus)
                                    arr.push(<li key={i} onClick={function (i, e) {
                                        this.setState({
                                            focus: i
                                        })
                                    }.bind(t, i + 1)} className={(m?classes.rollListMargin:'')+' '+classes.rollList+' '+(f?classes.focus:'')}></li>)
                                }
                                return arr
                            })(this)}
                        </ul>
                    </div>
                </div>
            </div>

        )
    }
}
export default withStyles(styles)(Alternating)