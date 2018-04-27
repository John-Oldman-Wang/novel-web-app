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
    }
    render(){
        const {classes} = this.props
        return (
        <React.Fragment>
            <div className={classes.head}>
                <IndexAppBar />
            </div>
            <Grid className={classes.content} container spacing={16}>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard onClick={e=>{
                    console.log('click')
                    this.props.history.push('/novel')
                }} /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
                <Grid item lg={2} md={3} xs={4} ><ColumnCard /></Grid>
            </Grid>
        </React.Fragment>
        )
    }
}

exports.Index = withStyles(styles)(Index)