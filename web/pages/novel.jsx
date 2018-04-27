import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles';


import OtherAppBar from '../comps/otherAppBar.jsx'
import RowCard from '../comps/rowCard.jsx'
const styles = {
    content: {
        padding: 8,
        fontSize: `0`
    }
}
class Novel extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <div>
                    <OtherAppBar {...this.props}/>
                </div>
                <div className={classes.content}>
                    <RowCard />
                </div>
            </React.Fragment>
        )
    }
}

exports.Novel = withStyles(styles)(Novel)