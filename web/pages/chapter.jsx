import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Button from 'material-ui/Button';
import SpeedMenu from '../comps/SpeedMenu.jsx'

const styles = theme => ({
    root: {
        padding: 8,
        backgroundImage: `linear-gradient`
    },
    content:{
        padding: `10px 0px`,
        fontFamily: "Microsoft YaHei" 
        // overflow: `scroll`
    },
    textIndent:{
        textIndent: `2em`,
        padding: `0px 8px`,
    },
    button:{
        fontSize: `20px`,
        fontWeight: 900
    }
})

class Chapter extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Paper className={classes.content} elevation={4}>
                        <div style={{
                            display: `flex`,
                            justifyContent: ``
                        }}>
                        <Button className={classes.button}>《狂神》</Button>
                        <Typography style={{
                            lineHeight: `44px`,
                            fontWeight: 900
                        }} component="h5">
                            我的世界
                        </Typography>
                        </div>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                        <Typography className={classes.textIndent} component="p">
                            我的实际啊是多久啊是看得见爱神的箭啊是多久啊是的啊实打实的骄傲是多久啊是大声的阿斯顿阿斯顿阿斯顿
                        </Typography>
                    </Paper>
                    <SpeedMenu />
                </div>
            </React.Fragment>
        )
    }
}

exports.Chapter = withStyles(styles,{withTheme: true})(Chapter)