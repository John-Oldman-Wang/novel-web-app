import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';


import SpeedMenu from '../comps/SpeedMenu.jsx'

const styles = theme => ({
    root: {
        position: `relative`,
        heigth: `100%`
    },
    content:{
        width: `100%`,
        height: `100%`
    }
})

class Chapter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }
    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Paper className={classes.content} elevation={4}>
                        <Typography variant="headline" component="h3">
                            This is a sheet of paper.
                        </Typography>
                        <Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography><Typography component="p">
                            Paper can beasdasdasdasdasd used to build surface or other elements for your application.
                        </Typography>
                    </Paper>
                    <SpeedMenu />
                </div>
            </React.Fragment>
        )
    }
}

exports.Chapter = withStyles(styles)(Chapter)