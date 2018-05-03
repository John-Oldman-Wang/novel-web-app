import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import IndexAppBar from '../comps/indexAppBar.jsx'
import ColumnCard from '../comps/columnCard.jsx'

const styles = {
    content:{
        padding: 8,
    }
}
class Index extends Component {
    constructor(props){
        super(props)
        window.i=this
    }
    render(){
        const { classes, data, dispatch} = this.props
        return (
        <React.Fragment>
            <div className={classes.head}>
                <IndexAppBar />
            </div>
            <Grid className={classes.content} container spacing={16}>
                {data.map( (item, index)=>{
                    return (<Grid key={index} item lg={2} md={3} xs={4} >
                        <ColumnCard onClick={()=>{
                            this.props.history.push(`/novel?v=${item._id}`)
                            dispatch(item)
                        }} title={item.title} author={item.author} image={item.image}/>
                    </Grid>)
                })}
            </Grid>
        </React.Fragment>
        )
    }
}

export default withStyles(styles)(Index)