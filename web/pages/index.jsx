import React, { Component } from 'react'
import { withStyles } from 'material-ui';
import IndexAppBar from '../comps/indexAppBar.jsx'
import SwipeableDrawer from 'material-ui/SwipeableDrawer';
const styles = {
    
}
class Index extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return <IndexAppBar />
    }
}

exports.Index = withStyles(styles)(Index)