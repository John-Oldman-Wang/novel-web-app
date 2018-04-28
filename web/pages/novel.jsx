import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles';

import OtherAppBar from '../comps/otherAppBar.jsx'
import RowCard from '../comps/rowCard.jsx'
import DirectoryList from '../comps/DirectoryList.jsx'

const styles = theme=>({
    content: {
        padding: 8,
        fontSize: `0`
    },
})

class Novel extends Component {
    constructor(props) {
        super(props)
        this.state={
            open: false
        }
    }
    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <div>
                    <OtherAppBar title="狂神狂神狂神狂神狂神狂神狂神狂神狂神" {...this.props}/>
                </div>
                <div className={classes.content}>
                    <RowCard />
                </div>
                <div className={classes.content}>
                    <DirectoryList onClick={(e,item)=>{
                        this.props.history.push('/chapter')
                    }}/>
                </div>
            </React.Fragment>
        )
    }
}

exports.Novel = withStyles(styles)(Novel)