import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import SpeedMenu from '../comps/SpeedMenu.jsx'

const styles = (theme)=>({
    root: {
        padding: 8,
        backgroundImage: `linear-gradient`
    },
    content: {
        padding: `10px 0px`,
        fontFamily: "Microsoft YaHei"
        // overflow: `scroll`
    },
    textIndent: {
        textIndent: `2em`,
        padding: `0px 8px`,
        boxShadow: `none`
    },
    button: {
        fontSize: `20px`,
        fontWeight: 900,
        width: `auto`
    }
})

class Chapter extends Component {
    constructor(props) {
        super(props)
        window.c = this
    }
    render() {
        const { classes, index } = this.props
        const { novel, chapter } = (this.props.novelChapter || {})
        console.log('chapter', novel,chapter)
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Paper className={classes.content} elevation={4}>
                        <div style={{
                            display: `flex`,
                            justifyContent: ``
                        }}>
                            <Button className={classes.button}>{novel ? `《${(novel||{})['title']}》` : ""}</Button>
                            <Typography style={{
                                lineHeight: `44px`,
                                fontWeight: 900,
                                boxShadow: `none`
                            }} component="h5">
                                {chapter&&chapter.title || ""}
                            </Typography>
                        </div>
                        {(chapter&&chapter.paragraphs || []).map((item, index) => {
                            return (<Typography key={index} className={classes.textIndent} component="p">
                                {item}
                            </Typography>)
                        })}
                    </Paper>
                    <SpeedMenu onClick={(item) => {
                        if (index == undefined) {
                            return
                        }
                        if (item.name == "Prev") {
                            if (index == 0) {
                                return
                            }
                            this.props.history.push(`/chapter?c=${novel.chapters[index - 1].chapter_id}`)
                        } else if (item.name == "Next") {
                            var chapters = novel.chapters
                            if (index == chapters.length - 1) {
                                return
                            }
                            this.props.history.push(`/chapter?c=${chapters[index + 1].chapter_id}`)
                        }
                    }} />
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Chapter)